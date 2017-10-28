/**
 * Created by babacar on 04/10/2017.
*/
angular.module('app')

  .controller('SearchController', function ($scope, $rootScope, $stateParams, Store, $state, HomeService) {
    $scope.Results = [];
    $scope.Billets = [];
    $scope.search  = {
      key : '',
      value : ''
    };
    $scope.searchDone = 0;

    $scope.Criteres = [
      {
        libelle : 'Evenement',
        id: 'libelle'
      },
      {
        libelle : 'Ville',
        id: 'ville'
      },
      {
        libelle : 'Pays',
        id: 'pays'
      },
      {
        libelle : 'Lieu',
        id: 'lieu'
      }
    ];

    // $scope.searchBillet = function () {
    //   if ($scope.search.key !== '' && $scope.search.value !== '') {
    //     $scope.searchDone = 0;
    //     $scope.Results = [];
    //     angular.forEach($scope.Billets, function (value, key) {
    //       if(angular.lowercase(value[$scope.search.key]) === angular.lowercase($scope.search.value)) {
    //         $scope.Results.push(value);
    //       }
    //     });
    //     $scope.searchDone = 1;
    //   }
    // };

    $scope.getAllBillets = function() {
      HomeService.getBilletService()
      .then(function (res) {
        if (!angular.isUndefined(res)) {
          $scope.saveBillets(res);
        }
        $scope.searchDone = 1;
      });
    }

    $scope.saveBillets = function(res) {
      for (var i = 0; i < res.length; i++) {
        $scope.Billets.push({
          id: res[i].id,
          libelle: res[i].libelle,
          code: res[i].code,
          lieu: res[i].lieu,
          region: res[i].region,
          ville: res[i].ville,
          is_free: res[i].is_free,
          date_expiration: res[i].date_expiration,
          description: res[i].description,
          tva: res[i].tva,
          type_billet: res[i].typebillets,
          taux_the_commission: res[i].taux_the_commission,
          surchage_paypal: res[i].surchage_paypal,
          commission_om: res[i].commission_om,
          commission_paypal: res[i].commission_paypal,
          commission_wari: res[i].commission_wari,
          image: res[i].image.id + "." + res[i].image.chemin
        });
      }
      Store.setBilletResultSearch($scope.Billets);
    };

    $scope.getAllBillets();
  });
