
var _ = require('underscore');
var request = require('request');
var scheduler = require('../../server/lib/scheduler.js');

module.exports = function(Subscriber) {

  Subscriber.afterRemote('create', function(ctx, user, next) {

    var req = ctx.req;
    var host = req.headers.host;

    request({
      url: 'http://localhost:4100/api/mentStorages',
      method: "POST",
      json: true,
      body: { "name" : req.body.tel}
    }, function( error, response, body ) {
      if(error)
        console.log(error);
    });

    request({
      url: 'http://localhost:4100/api/imageStorages',
      method: "POST",
      json: true,
      body: { "name" : req.body.tel}
    }, function( error, response, body ) {
      if(error)
        console.log(error);
    });

    request({
      url: 'http://localhost:4100/api/recordStorages',
      method: "POST",
      json: true,
      body: { "name" : req.body.tel}
    }, function( error, response, body ) {
      if(error)
        console.log(error);
    });

    next();

  });


  Subscriber.observe('after delete', function(ctx,next){

    var app = Subscriber.app;
    var planId;

    app.models.Plan.find({where: {ownerId: ctx.where.id}},function(err,records){
      _.each(records,function(record){
        app.models.Plan.destroyById(record.id,function(err){

          if(err) console.stack(err);

          console.log('deleted Plan(%s) count ', record.id);
        });

      });
    });

    next();

  })
};
