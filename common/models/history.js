var datasource = require('../../server/datasources.development');
var redis = require('redis');

module.exports = function(History) {

  History.observe('before save', function(ctx, next) {

    if(ctx.isNewInstance) {

      next();

    } else {

      var app = History.app;
      var Plan = app.models.Plan;
      var history;
      var endTime = new Date();
      var plan;

      Plan.findById(ctx.currentInstance.__data.planInfo.id,function(err,instance){

        if(err) console.stack(err);

        instance.updateAttributes({callState: 'Disconnected'},function(err,instance){

          console.log('log:' + instance);

        });

        ctx.data.planInfo = instance.__data;
        ctx.data.endTime = endTime;

        next();

      });

    }
  });

  History.observe('after save', function(ctx, next) {

  });

};
