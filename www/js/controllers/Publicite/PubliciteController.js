/**
 * Created by lakhassane on 19/07/2016.
 */

angular.module('app')

  .controller('PubliciteController', function ($scope, $stateParams, $rootScope, PubliciteService) {

    $scope.Pubs = {
      id: '',
      titre: '',
      image: ''
    };

    var id = $stateParams.id;

    //$scope.getPubliciteById = function( id ) {
      PubliciteService.getPubliciteByIdService( id )
        .then(function (res ) {
          //console.log(res);
          $scope.Pubs.id = res.id;
          $scope.Pubs.titre = res.titre;
          $scope.Pubs.image = res.image.id+"."+res.image.chemin;
          console.log($scope.Pubs);
          $rootScope.nbrePubs--;
        }, function( error ) {
          console.log(error);
        });
    //}

   // $scope.getPublicitesById( id );

  });

