/**
 *
 * Created by kimjin-young on 2015. 6. 2..
 */

/*
module.exports = function(app) {

    // checking no subscriber
    app.models.Subscriber.find(function(err, subscribers){
      if(err) throw err;

      var plans = [
        {ownerId : 01044929591, title: "callPlan1", attendees: [{"tel": "01044929591","role": "owner"},{"tel": "0220145199","role": "member"}]},
        {ownerId : 01044929592, title: "callPlan2", attendees: [{"tel": "01044929592","role": "owner"},{"tel": "0220145199","role": "member"}]},
        {ownerId : 01044929593, title: "callPlan3", attendees: [{"tel": "01044929593","role": "owner"},{"tel": "0220145199","role": "member"}]},
        {ownerId : 01044929594, title: "callPlan4", attendees: [{"tel": "01044929594","role": "member"},{"tel": "0220145199","role": "owner"}]},
        {ownerId : 0220145199, title: "callPlan5", attendees: [{"tel": "0220145199","role": "owner"},{"tel": "01044929592","role": "member"}]}
      ];

      var count = plans.length;

      plans.forEach(function(plan){
        app.models.Plan.create(plan, function(err,instance){
          if(err) return console.log(err);

          console.log('Plan created:', instance.id);
          count--;

            var attendees = instance.__data.attendees;
            var count2 = attendees.length;

            attendees.forEach(function(attendee){

              attendee.planId = instance.id;

              app.models.Attendee.create(attendee, function(err,instance2){
                if(err) return console.log(err);

                console.log('Attendee created: ' + instance2);
                count2--;

                if(count2 === 0) console.log('Attendee Done');
              });
            });

          if(count ===0) console.log('done');

        });

      });

    });
}
*/

