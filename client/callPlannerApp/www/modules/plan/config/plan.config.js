'use strict';

angular.module('com.module.plan')
  .run(function($rootScope){


    // Add Plan menu
    $rootScope.addMenu('Plan', 'app.plan.planList','ion-android-calendar');

  });
