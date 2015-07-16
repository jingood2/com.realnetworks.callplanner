/**
 *
 * Created by kimjin-young on 2015. 7. 1..
 */


var datasource = require('../datasources.development.js');
var conf = require('../../global-config');

module.exports = function(app) {
    var redis = require('redis'),
        sprintf = require('sprintf').sprintf,
        client = redis.createClient(datasource.redis.port,datasource.redis.host),
        phone;

    client.on("error", function(err){
        console.log("Error : " + err);
    });

    for (var i=conf.conferenceNum.min; i <= conf.conferenceNum.max;i++) {
        phone = sprintf('%s%04d', conf.conferenceNum.prefix,i);
        client.lpush("conferenceId",phone);
    }



}




