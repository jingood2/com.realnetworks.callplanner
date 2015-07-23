'use strict';

angular.module('com.module.plan')
  .controller('PlanCtrl',function($scope,$state,$location,$stateParams,Plan,Subscriber,LoopBackAuth){

    console.log('[PlanCtrl]CurrentState:' + $state.current.name);

  });
