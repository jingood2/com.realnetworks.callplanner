'use strict';

angular.module('com.module.plan')
  .controller('PlanCtrl',function($scope,$state,$location,$stateParams,Plan,Subscriber,LoopBackAuth){

    console.log('[PlanCtrl]CurrentState:' + $state.current.name);

    $scope.planArray = [];

    $scope.listPlans = function() {

      Plan.listPlans(

      function(res){

        res.listPlans.forEach(function(plan){
          console.log(plan);
          $scope.planArray.push(plan);
        });
        //console.log(res.listPlans);
        /*
        res.forEach(function(plan){

          planArray.push(plan);

        });
        */

      },function(err){

      });

    }

    $scope.listPlans();

  });
