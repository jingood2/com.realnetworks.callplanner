/**
 * Created by kimjin-young on 2015. 7. 21..
 */

angular.module('com.module.users')
.controller('LoginCtrl',function($scope,$state,Subscriber,$location){

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    var TWO_WEEKS = 1000 * 60 *60 * 24 * 7 *2;

    $scope.credentials = {
      ttl: TWO_WEEKS,
      rememberMe :  true
    };

    /*
    if(CoreService.env.name === 'development') {
      $scope.credentials.email = 'admin@admin.com';
      $scope.credentials.passwrd = 'admin';
    }
    */

    $scope.login = function() {

      $scope.loginResult = Subscriber.login({
        include: 'user',
        rememberMe: $scope.credentials.rememberMe
      },$scope.credentials,function(Subscriber){

        console.log(Subscriber.id);     //  access token
        console.log(Subscriber.ttl);
        console.log(Subscriber.created);
        console.log(Subscriber.userId);

        var next = $location.nextAfterLogin || '/';
        $location.nextAfterLogin = null;

        if(next === '/intro') {
          next = '/';
        }

        console.log('next:' + next);
        $location.path(next);

      },function(res){
        $scope.loginError = res.data.error;
      });

    }

});
