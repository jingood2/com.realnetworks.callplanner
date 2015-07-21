/**
 * Created by kimjin-young on 2015. 7. 21..
 */

angular.module('com.module.users')
.controller('SignupCtrl',function($scope,$routeParams,$location,$filter,Subscriber){

    // Form data for the signup modal
    $scope.registration = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      tel: ''
    };

    $scope.confirmPassword = '';

});
