/**
 * Created by lakhassane on 04/10/2016.
 */

angular.module('app')

  .controller('ScanController', function ($scope, $state, $rootScope, $timeout, $ionicLoading, $cordovaBarcodeScanner, ScannerService) {

    $scope.qrcode = {
      qrcode: ''
    };

    $scope.scannerActive = false;
    $scope.scannnn = function() {


      //alert('click: ' + $scope.scannerActive);

      localStorage.setItem("reset", 0);
      //$rootScope.showAlert("Démarrage du scan", "blue");
      //scanner.scan(function ( barcodeData ) {
      if(!$scope.scannerActive) {
        $scope.scannerActive = true;
        cordova.plugins.barcodeScanner.scan(function (barcodeData) {
            //alert(barcodeData.cancelled);
            if (!barcodeData.cancelled) {
              $ionicLoading.show({
                template: 'Chargement...',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
              });
              console.log(barcodeData.cancelled);
              $scope.qrcode.qrcode = JSON.stringify(barcodeData.text);
              //alert($scope.qrcode.qrcode);
              // From this point, we split the text we get from barcodeData
              //var array = $rootScope.qrcode.qrcode.split('.png');
              var code = $scope.qrcode.qrcode.split('"');
              //var code = array[0].split('"');
              $scope.qrcode.qrcode = code[1];
              //alert($scope.qrcode.qrcode);
              ScannerService.postScanService($scope.qrcode)
                .then(function (res) {
                  $ionicLoading.hide();
                  console.log(res.data);
                  //alert('resultat  : ' + res.data.resultat);
                  //alert('resultat 2 : ' + res.data.echec);
                  if ( res.data.echec == 113 ) {
                    $rootScope.showAlert("Ce ticket est inconnu du système", "red");
                    $state.go('tabsController.soldeScan');
                  } else if ( res.data.echec == 1 ) {
                    $rootScope.showAlert("Ce ticket a déjà été scanné !", "red");
                    $state.go('tabsController.soldeScan');
                  } else if ( res.data.echec == 112 ) {
                    $rootScope.showAlert("Aucun code récupéré !", "red");
                    $state.go('tabsController.soldeScan');
                  } else if ( res.data.echec == 114 ) {
                    $rootScope.showAlert("Ce ticket a déjà été scanné", "red");
                    $state.go('tabsController.soldeScan');
                  } else if ( res.data.echec == 115 || res.data.echec == 111 ) {
                    $rootScope.showAlert("Vous n\'êtes pas autorisé à scanner ce ticket.", "red");
                    $state.go('tabsController.soldeScan');
                  } else if ( res.data.echec == 4 ) {
                    $rootScope.showAlert("La totalité des billets a été scannée !", "red");
                    $state.go('tabsController.soldeScan');
                  } else if ( res.data.echec == 116 ) {
                    $rootScope.showAlert("Ce billet provient d'un évènement passé !", "red");
                    $state.go('tabsController.soldeScan');
                  } else if ( res.data.echec == 117 ) {
                    $rootScope.showAlert("Ticket inconnu du système !", "red");
                    $state.go('tabsController.soldeScan');
                  } else if ( res.data.echec == 118 ) {
                    $rootScope.showAlert("Ce billet a expiré !", "red");
                    $state.go('tabsController.soldeScan');
                  } else if ( res.data.echec == 119 ) {
                    $rootScope.showAlert("Dotation épuisé !", "red");
                    $state.go('tabsController.soldeScan');
                  } else {
                    //$rootScope.showAlert("Scan effectué avec succès !", "green");
                    $timeout(function() {
                      $state.go('tabsController.scan', {}, {reload: true});
                    }, 1000);
                  }
                }, function (err) {
                  $ionicLoading.hide();

                  console.log(err);
                });
            } else {
              //$ionicLoading.hide();
              $state.go('tabsController.soldeScan')
            }
          }, function (error) {
            //alert(JSON.stringify(error));
          },
          {
            "prompt": "Placer un QRCode dans le cadre"
          });
      }
    };

    $scope.scannnn();


  });

