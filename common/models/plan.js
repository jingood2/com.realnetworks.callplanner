// require 'server.js' as you would mormally do in any node.js app
//var app = require('../../server/server');
var _ = require('underscore');
var scheduler = require('../../server/lib/scheduler.js');
var datasource = require('../../server/datasources.development');


module.exports = function(Plan) {

  /*
   * custom REST API
   */
  // get planList
  Plan.listPlans = function(request, cb) {

    var app = Plan.app;
    var attendee = app.models.Attendee;
    var tel;

    ownerId =  request.accessToken.userId;

    attendee.find({
      include: 'plan', where: {userId: ownerId}
    },function(err,listPlans){
      if(err) {
        console.log(err);
      }
      console.log(listPlans);

      cb(err,listPlans);
    });

  }

  Plan.remoteMethod(
    'listPlans',
    {
      accepts: { arg: 'request', type: 'object', http:{source: 'req'}},
      http: {path: '/listPlans', verb: 'get'},
      returns : { arg: 'listPlans', type: 'array'}
    }

  );

  Plan.beforeRemote('create', function(ctx, affectedModelInstance, next) {

    var req = ctx.req;

    console.log('[beforeRemote] Plan create..')

    if(ctx.req.accessToken) {
      // set FK for subscriber
      req.body.ownerId = req.accessToken.userId;
      console.log('[beforeRemote] ownerId: ' + req.body.ownerId);
      next();
    } else {
      next(new Error("must be logged in to create plan"));
    }

  })

  Plan.afterRemote('create', function(ctx, plan, next) {

    var redis = require('redis');
    var client = redis.createClient(datasource.redis.port,datasource.redis.host);

    client.on("error", function (err) {
      console.log("error event - " + client.host + ":" + client.port + " - " + err);
    });

    client.lpop("conferenceId",function(err,confId){

      if(err){
        console.log('failed to get a free conferenceId!');
        console.stack(err);
      }

      scheduler.addPlanJob(plan.id,plan,confId);

    });

    next();

  });

  Plan.observe('before save', function updateTimestamp(ctx, next){

    var app = Plan.app;
    var attendees = ctx.instance.__data.attendees;

    // find exchange email for member from Subscriber
    app.models.Subscriber.find({where: {tel: {inq: _.pluck(attendees,'tel') }}}, function(err, subsObj) {

      if(err) {
        // ToDo: rollback created Plan
        return console.trace(err);
      }

      _.each(subsObj, function(sub){
        for(var i=0; i < attendees.length;i++){
          if (sub.tel === attendees[i].tel) {
            ctx.instance.__data.attendees[i].userId = sub.id;
            ctx.instance.__data.attendees[i].exchangeEmail = sub.exchangeEmail;
            ctx.instance.__data.attendees[i].exchangePassword = sub.exchangePassword;
          }

        }
      });

      //console.log(ctx.instance.__data.attendees);
    });


    next();

  })

  // The after save hook is called after a model change was successfully persisted to the datasource.
  Plan.observe('after save', function(ctx,next){

    var app = Plan.app;
    var Subscriber = app.models.Subscriber;

    if(ctx.isNewInstance) {

      // before create job
      var attendees = ctx.instance.__data.attendees;

      console.log('[after save]' + attendees);

      attendees.forEach(function(attendee){
        attendee.planId = ctx.instance.id;
      });

      // add members included in the lan to attendee
      app.models.Attendee.create(attendees, function(err,attendObj){
        if(err) {
          // ToDo: rollback created Plan
          return console.log(err);
        }

        console.log(attendObj);

        //next();

      });

    }else {
      console.log('Updated %s matching', ctx.Model.pluralModelName);

      var attendees = ctx.instance.__data.attendees;

      if(attendees){

          app.models.Attendee.destroyAll({planId: ctx.instance.id},function(err,info){

            if(err) console.stack(err);

            var attendees = ctx.instance.__data.attendees;

            attendees.forEach(function(attendee){
              attendee.planId = ctx.instance.id;
            });

            // add members included in the lan to attendee
            app.models.Attendee.create(attendees, function(err,attendObj){
              if(err) {
                // ToDo: rollback created Plan
                return console.log(err);
              }

              console.log(attendObj);

              //next();

            });


          });

      }

    }
    next();

  })


  Plan.observe('after delete', function(ctx,next){

    var app = Plan.app;

    if(ctx.where.id) {

      app.models.Attendee.destroyAll({planId:  ctx.where.id},function(err,info){

        if(err) console.stack(err);

        console.log('deleted Attendees :' + info.count);

      });

      scheduler.removePlanJob(ctx.where.id);


    } else {



    }

    next();

  })

};
