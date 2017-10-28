/**
 * Created by lakhassane on 02/06/2016.
 */

angular.module('app')

  .service('AccountService', function ($http, config, $rootScope, $ionicLoading) {

    return {
      getAchatService: function (id_user) {
        $rootScope.loadingDone = 0;
        return $http.get(config.URL + "/api/achats/" + id_user)
          .then(function (res) {
            $rootScope.loadingDone = 1;
            console.log(res);
            return res.data;
          }, function (error) {
            console.log(error);
            return error.data;
          })
      },

      getReservationService: function (id_user) {
        $rootScope.loadingDone = 0;
        return $http.get(config.URL + "/api/reservations/" + id_user)
          .then(function (res) {
            $rootScope.loadingDone = 1;
            console.log(res);
            return res.data;
          }, function (error) {
            console.log(error);
            return error.data;
          })
      },

      getQRCodeAchatService: function (idAchat) {
        return $http.get(config.URL + "/api/qrcodes/" + localStorage.getItem('authorizationToken') + "/ids/" + idAchat)
          .then(function (res) {
            return res.data;

          }, function (error) {
            console.log(error);
            return error.data;
          })
      },

      getQRCodeTransfertService: function (idTransfert) {
        return $http.get(config.URL + "/api/qrcodes/" + localStorage.getItem('authorizationToken') + "/transferts/" + idTransfert)
          .then(function (res) {
            return res.data;

          }, function (error) {
            console.log(error);
            return error.data;
          })
      },

      getQRCodeReservationService: function (idReservation) {
        return $http.get(config.URL + "/api/qrcodes/" + localStorage.getItem('authorizationToken') + "/reservations/" + idReservation)
          .then(function (res) {
            return res.data;
          }, function (error) {
            console.log(error);
            return error.data;
          })
      },

      transfertTicketService: function (idTicket, idAchat, transfert) {
        $ionicLoading.show({
          template: 'Transfert en cours...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        return $http({
          method: "POST",
          url: config.URL + "/api/transferts/" + localStorage.getItem('authorizationToken') + "/tickets/" + idTicket,
          data: {
            achat: idAchat,
            telephone: transfert.telephone,
            quantite: transfert.quantite
          }
        })
          .then(function (res) {
            $ionicLoading.hide();
            console.log(res);
            return res.data;
          }, function (error) {
            $ionicLoading.hide();
            console.log(error);
            return error.data;
          })
      },

      getTicketsTransfereService: function () {
        $rootScope.loadingDone = 0;
        return $http.get(config.URL + "/api/transferts/" + localStorage.getItem('authorizationToken'))
          .then(function (res) {
            $rootScope.loadingDone = 1;
            console.log(res);
            return res.data;
          }, function (error) {
            return error.data;
          })
      },

      transfertTicketTransfereService: function ( idTransfert, transfert2 ) {
        $ionicLoading.show({
          template: 'Transfert en cours...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        return $http({
          method: "POST",
          url: config.URL + "/api/transferts/" + localStorage.getItem('authorizationToken') + "/tickets",
          data: {
            transfert: idTransfert,
            telephone: transfert2.telephone,
            quantite: transfert2.quantite
          }
        })
          .then(function (res) {
            $ionicLoading.hide();
            console.log("resultat transfert");
            console.log(res);
            return res.data;
          }, function (error) {
            $ionicLoading.hide();
            console.log(error);
            return error.data;
          })
      },

      getScanAchatService: function( idAchat ) {
        return $http({
          method: "GET",
          url: config.URL + "/api/scans/" + localStorage.getItem("authorizationToken") + "/achats/" + idAchat
        })
          .then( function( res ) {
            console.log( res );
            return res.data;
          }, function( error ) {
            console.log( error );
            return error.data;
          })
      },

      getDailyScanService: function() {
        $rootScope.loadingDone = 0;
        return $http({
           method: "GET",
           url: config.URL + "/api/scans/" + localStorage.getItem("authorizationToken") +"/client"
        })
          .then( function( res ) {
            //console.log( res );
            $rootScope.loadingDone = 1;
            return res.data;
           }, function( error ) {
            console.log( error );
            return error.data;
           })
       },

      supprimerAchatService: function(idTransaction) {
        return $http.get(config.URL + "/api/supprimers/" + localStorage.getItem('authorizationToken')+"/transactions/"+idTransaction)
          .then(function( res ) {
            return res.data;
          }, function( error ) {
            return error.data;
          })
      }
    }

  });

