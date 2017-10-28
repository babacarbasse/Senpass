/**
 * Created by lakhassane on 29/03/2016.
 */

angular.module('app')

  .controller('PlusController', function (Store,HomeService, $scope, $stateParams, $state, LoginService, plusPageService, $rootScope) {

    $scope.informationsUser = {
      id: '',
      email: '',
      telephone: '',
      avatar: ''
    };

    $scope.informationsClient = {
      id: '',
      prenom: '',
      nom: '',
      adresse: ''
    };

    if (Store.getUserLocation() === '') {
      HomeService.getCountryCodeFromIpAdress()
      .then(function (res) {
          console.log('====================================');
          console.log(res);
          console.log('====================================');
          Store.setUserLocation(res);
          $scope.pays = Store.getUserLocation();
      });
    } else {
        $scope.pays = Store.getUserLocation();
    }

    $scope.getInformationsUser = function (id_user) {
      LoginService.getInformationsUserService(id_user)
        .then(function (res) {
          $scope.photo = 0;
          //alert(JSON.stringify(res.client.prenom));
          $scope.informationsUser.id = res.id;
          $scope.informationsUser.email = res.email;
          $scope.informationsUser.telephone = res.telephone;
          if ( !angular.isUndefined( res.image ) ) {
            $scope.photo = 1;
            $scope.informationsUser.avatar = res.image.id+"."+res.image.chemin;
            localStorage.setItem("myAvatar", $scope.informationsUser.avatar);
          }
          $scope.informationsClient.id = res.client.id;
          $scope.informationsClient.prenom = res.client.prenom;
          $scope.informationsClient.nom = res.client.nom;
          $scope.informationsClient.adresse = res.client.adresse;

        /*  LoginService.getInformationsClientService(id_user)
            .then(function (res) {
              console.log(res);
              $scope.informationsClient.id = res[0].id;
              $scope.informationsClient.prenom = res[0].prenom;
              $scope.informationsClient.nom = res[0].nom;
              $scope.informationsClient.adresse = res[0].adresse;
            }, function (error) {
              console.log(error);
            })*/
        }, function (error) {
          console.log(error);
        })
    };

    $scope.savePersonalInfos = function(informationsUser, informationsClient) {
      plusPageService.savePersonalInfosService(informationsUser, informationsClient)
        .then( function ( res ) {
          console.log( res );
          $rootScope.showAlert("Informations mises à jour", "green");
          $state.go('tabsController.plusPage');
        }, function( error ) {
          console.log( error );
        });

      $state.go('tabsController.plusPage');

    };

    $scope.myGoBack = function() {
      $state.go('tabsController.plusPage');
    };

    $scope.getInformationsUser(localStorage.getItem("idUser"));
    //$scope.getInformationsUser(7);

  });
