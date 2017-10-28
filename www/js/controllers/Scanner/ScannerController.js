/**
 * Created by lakhassane on 01/08/2016.
 */

/**
 * Created by lakhassane on 19/07/2016.
 */

angular.module('app')

  .controller('ScannerController', function ($scope, $rootScope, ScannerService, scanInformations, $ionicLoading) {
    $rootScope.Scans = [];

   /* $scope.day = new Date().getDate();
    $scope.year = new Date().getFullYear();
    $scope.month = new Date().getUTCMonth() + 1;
    $scope.hour = new Date().getHours();
    $scope.minute = new Date().getMinutes();
    $scope.seconde = new Date().getSeconds();

    $scope.dateReset = $scope.year + "-" + $scope.month + "-" + $scope.day + " " + $scope.hour + ":"+$scope.minute+""+$scope.seconde;
    localStorage.setItem("dateReset", $scope.dateReset);*/

   // alert(localStorage.getItem("dateReset"));

    /*
     $ionicLoading.show({
     template: 'Chargement...',
     animation: 'fade-in',
     showBackdrop: true,
     maxWidth: 200,
     showDelay: 0
     });*/

    $scope.getScan = function () {
      $rootScope.Scans = [];
      /*ScannerService.getScanService(id_user)
       .then(function( res ){
       $scope.Scans = [];*/
       console.log( scanInformations );
        for (var i = 0; i < scanInformations.length; i++)
          $rootScope.Scans.push({
            id: scanInformations[i].id,
            date_scan: scanInformations[i].date_scan
          })
      $rootScope.nombreScans = scanInformations.length;


//        $ionicLoading.hide();

    };

    $scope.resetSolde = function () {
      localStorage.removeItem("dateReset");
      $scope.day = new Date().getDate();
      $scope.year = new Date().getFullYear();
      $scope.month = new Date().getUTCMonth() + 1;
      $scope.hour = new Date().getHours();
      $scope.minute = new Date().getMinutes();
      $scope.seconde = new Date().getSeconds();

      $rootScope.Scans = [];
      $rootScope.nombreScans = 0;
      $scope.dateReset = $scope.year + "-" + $scope.month + "-" + $scope.day + " " + $scope.hour + ":"+$scope.minute+":"+$scope.seconde;
      localStorage.setItem("dateReset", $scope.dateReset);
      //alert($scope.dateReset);
    };

    $scope.refreshSolde = function () {
      $rootScope.Scans = [];
      $scope.getScan();
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.getScan();

  });

