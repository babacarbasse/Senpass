/**
 * Created by lakhassane on 02/06/2016.
 */

angular.module('app')

  .controller('AccountController', function ($rootScope, $scope, $stateParams, $ionicModal,
                                             Store, AccountService, HomeService, $state, $cordovaActionSheet,
                                             $cordovaFileTransfer) {

    $scope.day = new Date().getDate();
    $scope.year = new Date().getFullYear();
    $scope.month = new Date().getUTCMonth();

    $rootScope.seuilScan = 0;

    $scope.BilletsAchetes = [];

    $scope.BilletsReserves = [];
    $scope.BilletsReservations = [];
    $scope.Reserves = [];

    $scope.BilletsTransferes = [];

    $scope.ImagesAchetes = [];
    $scope.ImagesReserves = [];

    var options = {
      title: 'Que voulez-vous faire ?',
      buttonLabels: ['Enregistrer'],
      addCancelButtonWithLabel: 'Annuler',
      androidEnableCancelButton : true,
      winphoneEnableCancelButton : true
    };

    $scope.actionSheet = function() {
      $cordovaActionSheet.show( options )
        .then(function( btnIndex ) {
          var index = btnIndex;

          if ( index == 1 ) {
            // TODO save image in gallery
           window.canvas2ImagePlugin.saveImageDataToLibrary(
             function(msg){
               console.log(msg);
               alert("Image enregistrée");
             },
             function(err){
               console.log(err);
             },
             document.getElementById('myCanvas')
           );
          }
        });
    };

    $scope.DetailsAchat = {
      idAchat: '',
      id: '',
      libelle: '',
      image: '',
      lieu: '',
      prix_unitaire: '',
      description: '',
      prix: '',
      date_expiration: '',
      qrCode: ''
    };
    $scope.DetailsRestauration = {
      idAchat: '',
      id: '',
      libelle: '',
      image: '',
      lieu: '',
      prix_unitaire: '',
      description: '',
      prix: '',
      date_expiration: '',
      qrCode: '',
      NCE: ''
    };
    $scope.DetailsArchive = {
      idArchive: '',
      id: '',
      libelle: '',
      date_scan: '',
      image: '',
      lieu: '',
      prix_unitaire: '',
      description: '',
      prix: '',
      date_expiration: '',
      qrCode: ''
    };
    $scope.DetailsReservation = {
      idReservation: '',
      id: '',
      libelle: '',
      image: '',
      lieu: '',
      description: '',
      date_expiration: '',
      qrCode: ''
    };
    $scope.DetailsTransfert= {
      id_transfert: '',
      id: '',
      libelle: '',
      image: '',
      lieu: '',
      prix_unitaire: '',
      description: '',
      prix: '',
      date_expiration: '',
      qrCode: ''
    };

    $scope.transfert = {
      quantite: '',
      telephone: '221',
      achat: ''
    };

    $scope.transfert2 = {
      quantite: '',
      telephone: '221',
      id_transfert: ''
    };

    $scope.nbreAchat = '2';
    $scope.messageAchat = "Chargement des achats...";

    $scope.getArchives = function () {
      $scope.BilletsArchives = [];
      AccountService.getDailyScanService()
        .then(function (resScan) {
          for (var i = 0; i < resScan.length; i++) {
            if ( resScan[i].achat != undefined ) {
              $scope.BilletsArchives.push({
                idArchive: Number(resScan[i].achat.id),
                date_scan: resScan[i].date_scan,
                id: resScan[i].achat.type_billet.billet.id,
                libelle: resScan[i].achat.type_billet.billet.libelle,
                image: resScan[i].achat.type_billet.billet.image.id + "." + resScan[i].achat.type_billet.billet.image.chemin,
                prix_unitaire: Number(resScan[i].achat.prix_unitaire),
                type_billet: resScan[i].achat.type_billet,
                date_expiration: resScan[i].achat.type_billet.billet.date_expiration,
                lieu: resScan[i].achat.type_billet.billet.lieu,
                quantite: Number(resScan[i].achat.quantite),
                type: "achat"
              });
            }
            if ( resScan[i].transfert != undefined ) {
              $scope.BilletsArchives.push({
                idArchive: Number(resScan[i].transfert.id),
                date_scan: resScan[i].date_scan,
                id: resScan[i].transfert.type_billet.billet.id,
                libelle: resScan[i].transfert.type_billet.billet.libelle,
                image: resScan[i].transfert.type_billet.billet.image.id + "." + resScan[i].transfert.type_billet.billet.image.chemin,
                prix_unitaire: Number(resScan[i].transfert.prix_unitaire),
                type_billet: resScan[i].transfert.type_billet,
                date_expiration: resScan[i].transfert.type_billet.billet.date_expiration,
                lieu: resScan[i].transfert.type_billet.billet.lieu,
                quantite: Number(resScan[i].transfert.quantite),
                type: "transfert"
              });
            }
          }
          if ( $scope.BilletsArchives.length == 0 ) {
            $scope.nbreArchives = 0;
            $scope.messageArchive = "Pas d'archives disponibles.";
          } else {
            $scope.nbreArchives = 1;
          }
          Store.setArchive($scope.BilletsArchives);
        });
    };

    $scope.getAchats = function (id_user) {
      $scope.Billets = [];
      AccountService.getAchatService(id_user)
        .then(function (res) {
          for (var i = 0; i < res.length; i++) {
            if (Number(res[i].quantite) != 0) {
              if (res[i].type_billet.billet.categorie.type != "Universitaire") {
                $scope.Billets.push({
                  idAchat: Number(res[i].id),
                  id: res[i].type_billet.billet.id,
                  libelle: res[i].type_billet.billet.libelle,
                  description: res[i].type_billet.billet.description,
                  image: res[i].type_billet.billet.image.id + "." + res[i].type_billet.billet.image.chemin,
                  prix_unitaire: Number(res[i].prix_unitaire),
                  type_billet: res[i].type_billet,
                  date_expiration: res[i].type_billet.billet.date_expiration,
                  lieu: res[i].type_billet.billet.lieu,
                  quantite: Number(res[i].quantite)
                });
              }
            }
          }
          if ( $scope.Billets.length == 0 ) {
            $scope.nbreAchat = 0;
            $scope.messageAchat = "Pas d'achats disponibles.";
          } else {
            $scope.nbreAchat = 1;
          }
          Store.setAchat($scope.Billets);

        }, function (error) {
          console.log(error);
        })
    };

    $scope.getRestaurations = function (id_user) {
      $scope.BilletsRestauration = [];
      $scope.ScanRestauration = [];
      AccountService.getAchatService(id_user)
        .then(function (res) {
          for (var i = 0; i < res.length; i++) {
            if (Number(res[i].quantite) != 0) {
              if (res[i].type_billet.billet.categorie.type == "Universitaire") {
                $scope.BilletsRestauration.push({
                  idAchat: Number(res[i].id),
                  id: res[i].type_billet.billet.id,
                  libelle: res[i].type_billet.billet.libelle,
                  image: res[i].type_billet.billet.image.id + "."+res[i].type_billet.billet.image.chemin,
                  prix_unitaire: Number(res[i].prix_unitaire),
                  type_billet: res[i].type_billet,
                  date_expiration: res[i].type_billet.billet.date_expiration,
                  lieu: res[i].type_billet.billet.lieu,
                  quantite: Number(res[i].quantite)
                });
                AccountService.getScanAchatService(Number(res[i].id))
                  .then(function (resScan) {
                    for ( var j = 0; j < resScan.length; j++ ) {
                      $scope.ScanRestauration.push({
                        id: resScan[j].id,
                        date_scan: resScan[j].date_scan
                      });
                      $scope.dateScan = new Date($scope.ScanRestauration[j].date_scan);
                      if ($scope.dateScan.getDate() == $scope.day &&
                        $scope.dateScan.getMonth() == $scope.month && $scope.dateScan.getFullYear() == $scope.year) {
                        $rootScope.seuilScan = $rootScope.seuilScan + 1;
                      }
                    }
                    console.log("seuil : " + $rootScope.seuilScan);
                  });
              }
            }

          }
          if ( $scope.BilletsRestauration.length == 0 ) {
            $scope.nbreAchat = 0;
            $scope.messageAchat = "Pas d'achats disponibles.";
          } else {
            $scope.nbreAchat = 1;
          }
          Store.setAchatRestauration($scope.BilletsRestauration);

        }, function (error) {
          console.log(error);
        })
    };

    $scope.getReservations = function (id_user) {
      $scope.BilletsReservations = [];
      AccountService.getReservationService(id_user)
        .then(function (res) {
          for (var i = 0; i < res.length; i++) {
            $scope.BilletsReserves.push({
              id: res[i].id
            });
          
            if (Number(res[i].quantite) != 0) {
              $scope.BilletsReservations.push({
                idReservation: res[i].id,
                id: res[i].billet.id,
                libelle: res[i].billet.libelle,
                image: res[i].billet.image.id + "." + res[i].billet.image.chemin,
                description: res[i].billet.description,
                date_expiration: res[i].billet.date_expiration,
                lieu: res[i].billet.lieu,
                quantite: Number(res[i].quantite),
                gerant: res[i].billet.gerant
              });
            }
          }
          if ( $scope.BilletsReserves.length == 0 ) {
            $scope.nbreReserves = 0;
            $scope.messageReserve = "Pas de réservations disponibles.";
          } else {
            $scope.nbreReserves = 1;
          }
          Store.setReservation($scope.BilletsReservations);
        }, function (error) {
          console.log(error);
        })
    };

    $scope.getTicketsTransferes = function () {
      $scope.TransfertsVide = "Pas de transferts reçus.";
      $scope.BilletsTransferes = [];
      AccountService.getTicketsTransfereService()
        .then(function (res) {
          for (var i = 0; i < res.length; i++) {
            if (Number(res[i].quantite) != 0) {
              $scope.BilletsTransferes.push({
                id_transfert: res[i].id,
                id: res[i].type_billet.billet.id,
                libelle: res[i].type_billet.billet.libelle,
                description: res[i].type_billet.billet.description,
                image: res[i].type_billet.billet.image.id + "." + res[i].type_billet.billet.image.chemin,
                date_expiration: res[i].type_billet.billet.date_expiration,
                date_transfert: res[i].date_transfert,
                lieu: res[i].type_billet.billet.lieu,
                prix_unitaire: res[i].prix_unitaire,
                quantite: Number(res[i].quantite),
                type_billet: res[i].type_billet,
                client: res[i].client
              });
            }
          }
          if ( $scope.BilletsTransferes.length == 0 ) {
            $scope.tailleTransfert = 0;
            $scope.TransfertsVide = "Pas de transferts reçus.";
          } else {
            $scope.tailleTransfert = 1;
          }
          Store.setTransfert($scope.BilletsTransferes);
        })
    };

    // This function sort the ticket bought by
    // writing them once and increasing the number if they are into
    // the array more than once.
    $scope.RangerBilletAchete = function (Array, FromArray) {
      // We start by adding the first ticket
      Array.push({
        libelle: FromArray[0].libelle,
        lieu: FromArray[0].lieu,
        date_expiration: FromArray[0].date_expiration,
        image: FromArray[0].image,
        nbre: FromArray[0].quantite
      });
      // Then we run the array
      var k = 1;
      while (k < FromArray.length) {
        // if the ticket is not in the right array (Achat)...
        if ($scope.notIn(Array, FromArray[k].libelle) == -1) { // we add it
          Array.push({
            libelle: FromArray[k].libelle,
            lieu: FromArray[k].lieu,
            date_expiration: FromArray[k].date_expiration,
            image: FromArray[k].image,
            nbre: FromArray[k].quantite
          });
        } else { // else we just increase its number by retrieving the position where it has been found
          console.log('quantite : ' + FromArray[k].quantite);
          Array[$scope.notIn(Array, FromArray[k].libelle)].nbre = Array[$scope.notIn(Array, FromArray[k].libelle)].nbre + FromArray[k].quantite;
        }
        k++;
      }
      //console.log("-----------RANGEMENT-----------");
      console.log(Array);
      //console.log("-----------FIN RANGEMENT-----------");
    };

    // This function verify if the libelle given is in the list of bought ticket
    $scope.notIn = function (Array, libelle) {
      var z = 0;
      for (z; z < Array.length; z++)
        if (Array[z].libelle == libelle) {
          //console.log('trouve');
          return z;
        }
      return -1;
    };

    $scope.redirectToAchatDetail = function (id, idAchat) {
      $state.go('tabsController.detailsAchats', {id: id, idAchat: idAchat});
    };

    $scope.redirectToArchiveDetail = function (id, idArchive) {
      $state.go('tabsController.detailsArchives', {id: id, idArchive: idArchive});
    };

    $scope.redirectToReservationDetail = function (id, idReservation) {
      $state.go('tabsController.detailsReservations', {id: id, idReservation: idReservation});
    };

    $scope.redirectToRestaurationDetail = function (id, idRestauration) {
      $state.go('tabsController.detailsRestauration', {id: id, idRestauration: idRestauration});
    };

    $scope.redirectToTransfertDetail = function (id, idTransfert) {
      $state.go('tabsController.detailsTransfert', {id: id, id_transfert: idTransfert});
    };

    $scope.getArchiveByIdBillet = function (id, idArchive) {
      for (var i = 0; i < Store.getArchive().length; i++) {
        if (!angular.isUndefined(Store.getArchive()[i]) && Store.getArchive()[i].idArchive == $stateParams.idArchive) {
          $scope.DetailsArchive.idArchive = idArchive;
          $scope.DetailsArchive.id = id;
          $scope.DetailsArchive.libelle = Store.getBilletByIdArchive(idArchive).libelle;
          $scope.DetailsArchive.date_scan = Store.getBilletByIdArchive(idArchive).date_scan;
          $scope.DetailsArchive.image = Store.getBilletByIdArchive(idArchive).image;
          $scope.DetailsArchive.lieu = Store.getBilletByIdArchive(idArchive).lieu;
          $scope.DetailsArchive.type_billet = Store.getBilletByIdArchive(idArchive).type_billet;
          //$scope.DetailsArchive.description = Store.getBilletByIdArchive(idArchive).description;
          $scope.DetailsArchive.date_expiration = Store.getBilletByIdArchive(idArchive).date_expiration;
          $scope.DetailsArchive.prix_unitaire = Store.getBilletByIdArchive(idArchive).prix_unitaire;
          $scope.DetailsArchive.type = Store.getBilletByIdArchive(idArchive).type;
          break;
        }
      }
      if ($scope.DetailsArchive.type == "achat") {
        AccountService.getQRCodeAchatService(idArchive)
          .then(function (res) {
            $scope.DetailsArchive.qrCode = res.qrCode;
          });
      }
      else {
        AccountService.getQRCodeTransfertService(idArchive)
          .then(function (res) {
            $scope.DetailsArchive.qrCode = res.qrCode;
          });
      }
    };

    $scope.getAchatByIdBillet = function (id, idAchat) {
      for (var i = 0; i < Store.getAchat().length + Store.getAchatRestauration().length; i++) {
        if (!angular.isUndefined(Store.getAchat()[i]) && Store.getAchat()[i].idAchat == $stateParams.idAchat) {
          $scope.DetailsAchat.idAchat = idAchat;
          $scope.DetailsAchat.id = id;
          $scope.DetailsAchat.libelle = Store.getBilletByIdAchat(idAchat).libelle;
          $scope.DetailsAchat.image = Store.getBilletByIdAchat(idAchat).image;
          $scope.DetailsAchat.lieu = Store.getBilletByIdAchat(idAchat).lieu;
          $scope.DetailsAchat.description = Store.getBilletByIdAchat(idAchat).description;
          $scope.DetailsAchat.date_expiration = Store.getBilletByIdAchat(idAchat).date_expiration;
          $scope.DetailsAchat.prix_unitaire = Store.getBilletByIdAchat(idAchat).prix_unitaire;
          $scope.DetailsAchat.type_billet = Store.getBilletByIdAchat(idAchat).type_billet;
          break;
        } else if (!angular.isUndefined(Store.getAchatRestauration()[i]) &&
          Store.getAchatRestauration()[i].idAchat == $stateParams.idRestauration ) {
          $scope.DetailsRestauration.idAchat = idAchat;
          $scope.DetailsRestauration.id = id;
          $scope.DetailsRestauration.libelle = Store.getBilletByIdAchatRestauration(idAchat).libelle;
          $scope.DetailsRestauration.image = Store.getBilletByIdAchatRestauration(idAchat).image;
          $scope.DetailsRestauration.lieu = Store.getBilletByIdAchatRestauration(idAchat).lieu;
         // $scope.DetailsRestauration.date_expiration = Store.getBilletByIdAchatRestauration(idAchat).date_expiration;
          $scope.DetailsRestauration.prix_unitaire = Store.getBilletByIdAchatRestauration(idAchat).prix_unitaire;
          $scope.DetailsRestauration.NCE = localStorage.getItem("NCE");
          $scope.DetailsRestauration.type_billet = Store.getBilletByIdAchatRestauration(idAchat).type_billet;
          break;
        }
      }
      AccountService.getQRCodeAchatService(idAchat)
        .then(function (res) {
          if( !angular.isUndefined($stateParams.idRestauration) ) {
            $scope.DetailsRestauration.qrCode = res.qrCode;

            var canvas = document.getElementById("myCanvas");
            var ctx = canvas.getContext("2d");

            canvas.width = window.innerWidth;
            //canvas.height = window.innerHeight;
            var image = new Image();
            image.src = "data:image/png;base64,"+$scope.DetailsRestauration.qrCode;
            image.width = canvas.width;
            image.height = 380;
            image.onload = function() {
              ctx.imageSmoothingEnabled = false;
              ctx.drawImage(image, 0, 0, canvas.width, 380);
            };

          } else {
            $scope.DetailsAchat.qrCode = res.qrCode;
            var canvas = document.getElementById("myCanvas");
            var ctx = canvas.getContext("2d");

            canvas.width = window.innerWidth;
            //canvas.height = window.innerHeight;
            var image = new Image();
            image.crossOrigin = 'Anonymous';
            image.src = "data:image/png;base64,"+$scope.DetailsAchat.qrCode;
            image.width = canvas.width;
            image.height = 380;
            image.onload = function() {
              ctx.imageSmoothingEnabled = false;
              ctx.drawImage(image, 0, 0, canvas.width, 380);
            };
          }
        });
    };

    $scope.getReservationByIdBillet = function (id, idReservation) {
      $scope.DetailsReservation.idReservation = idReservation;
      $scope.DetailsReservation.id = id;
      $scope.DetailsReservation.libelle = Store.getBilletByIdReservation(idReservation).libelle;
      $scope.DetailsReservation.image = Store.getBilletByIdReservation(idReservation).image;
      $scope.DetailsReservation.lieu = Store.getBilletByIdReservation(idReservation).lieu;
      $scope.DetailsReservation.description = Store.getBilletByIdReservation(idReservation).description;
      $scope.DetailsReservation.date_expiration = Store.getBilletByIdReservation(idReservation).date_expiration;
      $scope.DetailsReservation.gerant = Store.getBilletByIdReservation(idReservation).gerant;
      AccountService.getQRCodeReservationService(idReservation)
        .then(function (res) {
          $scope.DetailsReservation.qrCode = res.qrCode;
          
          var canvas = document.getElementById("myCanvas");
          var ctx = canvas.getContext("2d");

          canvas.width = window.innerWidth;
          //canvas.height = window.innerHeight;
          var image = new Image();
          image.src = "data:image/png;base64,"+$scope.DetailsReservation.qrCode;
          //image.src = "http://ngcordova.com/img/ngcordova-logo.png";
          image.width = canvas.width;
          image.height = 380;
          image.onload = function() {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(image, 0, 0, canvas.width, 380);
          };
        });
    };

    $scope.getTransfertByIdBillet = function (id, idTransfert) {
      for (var i = 0; i < Store.getTransfert().length; i++) {
        if (!angular.isUndefined(Store.getTransfert()[i]) && Store.getTransfert()[i].id_transfert == $stateParams.id_transfert) {
          $scope.DetailsTransfert.id_transfert = idTransfert;
          $scope.DetailsTransfert.id = id;
          $scope.DetailsTransfert.libelle = Store.getBilletByIdTransfert(idTransfert).libelle;
          $scope.DetailsTransfert.image = Store.getBilletByIdTransfert(idTransfert).image;
          $scope.DetailsTransfert.lieu = Store.getBilletByIdTransfert(idTransfert).lieu;
          $scope.DetailsTransfert.description = Store.getBilletByIdTransfert(idTransfert).description;
          $scope.DetailsTransfert.date_expiration = Store.getBilletByIdTransfert(idTransfert).date_expiration;
          $scope.DetailsTransfert.prix_unitaire = Store.getBilletByIdTransfert(idTransfert).prix_unitaire;
          $scope.DetailsTransfert.type_billet = Store.getBilletByIdTransfert(idTransfert).type_billet;
          break;
        }
      }
      AccountService.getQRCodeTransfertService(idTransfert)
        .then(function (res) {
          $scope.DetailsTransfert.qrCode = res.qrCode;

          var canvas = document.getElementById("myCanvas");
          var ctx = canvas.getContext("2d");

          canvas.width = window.innerWidth;
          //canvas.height = window.innerHeight;
          var image = new Image();
          image.src = "data:image/png;base64,"+$scope.DetailsTransfert.qrCode;
          //image.src = "http://ngcordova.com/img/ngcordova-logo.png";
          image.width = canvas.width;
          image.height = 380;
          image.onload = function() {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(image, 0, 0, canvas.width, 380);
          };
        });
    };

    $scope.typeAtransfert = '';

    $scope.transfertTicket = function (transfert) {
      if ($scope.typeAtransfert == "billetAchat") {
        idTicket = $scope.Billets[$scope.idBillet].id;
        idAchat = $scope.Billets[$scope.idBillet].idAchat;
        AccountService.transfertTicketService(idTicket, idAchat, transfert)
        .then(function (res) {
          console.log(res);
          if ( res.resultat == 1 ) {
            $rootScope.showAlert("Transfert réussi", "green");
          } else {
            $rootScope.showAlert( res.message, "red")
          }
          $scope.closeModalTransfert();
          if ($rootScope.toState == 'tabsController.achats') {
            $scope.getAchats(localStorage.getItem('idClient'));
          } else if ($rootScope.toState == 'tabsController.reservations') {
            $scope.getReservations(localStorage.getItem('idClient'));
          } else if ($rootScope.toState == 'tabsController.restauration') {
            $scope.getRestaurations(localStorage.getItem('idClient'));
          }
          $scope.transfert.achat = '';
          $scope.transfert.quantite = '';
          $scope.transfert.telephone = '221';
        }, function (error) {
          console.log(error);
        });
      } else {
        idTicket = $scope.BilletsTransferes[$scope.idBillet].id;
        idTransfert = $scope.BilletsTransferes[$scope.idBillet].id_transfert;
        AccountService.transfertTransfertTicketService(idTicket, idTransfert, transfert)
        .then(function (res) {
          if ( res.resultat == 1 ) {
            $rootScope.showAlert("Transfert réussi", "green");
          } else {
            $rootScope.showAlert( res.message, "red")
          }
          $scope.closeModalTransfert();
          if ($rootScope.toState == 'tabsController.achats') {
            $scope.getTicketsTransferes();
          } else if ($rootScope.toState == 'tabsController.reservations') {
            $scope.getReservations(localStorage.getItem('idClient'));
          } else if ($rootScope.toState == 'tabsController.restauration') {
            $scope.getRestaurations(localStorage.getItem('idClient'));
          }
          $scope.transfert.achat = '';
          $scope.transfert.quantite = '';
          $scope.transfert.telephone = '221';
        }, function (error) {
          console.log(error);
        });
      }
    };

    $scope.transfertTicketTransfere = function (idTransfert, transfert2) {
      /*if ( transfert2.telephone.substring(0, 3) != "221" ) {
        transfert2.telephone = "221"+transfert2.telephone;
      }*/
      AccountService.transfertTicketTransfereService(idTransfert, transfert2)
        .then(function (res) {
          if ( res.resultat == 1 ) {
            $rootScope.showAlert("Transfert réussi", "green");
          } else {
            $rootScope.showAlert( res.message, "red")
          }
          console.log(res);
          $scope.closeModalTransfert();
          $scope.getTicketsTransferes();
          $scope.transfert2.id_transfert = '';
          $scope.transfert2.quantite = '';
          $scope.transfert2.telephone = '221';

        }, function (error) {
          console.log(error);
        })
    };

    $scope.checkNumberScan = function (Array, id) {
      if ($scope.achatInScan(Array, id)) {
        //$rootScope.
      }
    };

    if ($rootScope.toState == 'tabsController.achats') {
      $scope.$on("$ionicView.enter", function (event, data) {
        $scope.getAchats(localStorage.getItem('idClient'));
        $scope.getTicketsTransferes();
      });
    } else if ($rootScope.toState == 'tabsController.reservations') {
      $scope.getReservations(localStorage.getItem('idClient'));
    } else if ($rootScope.toState == 'tabsController.transferts') {
      $scope.$on("$ionicView.enter", function (event, data) {
        $scope.getTicketsTransferes();
      });
    } else if ($rootScope.toState == 'tabsController.restauration') {
      $scope.$on("$ionicView.enter", function (event, data) {
        $scope.getRestaurations(localStorage.getItem('idClient'));
      });
    } else if ($rootScope.toState == 'tabsController.archives') {
      $scope.$on("$ionicView.enter", function (event, data) {
        $scope.getArchives();
      });
    }

    if (!angular.isUndefined($stateParams.idAchat)) {
      $scope.getAchatByIdBillet($stateParams.id, $stateParams.idAchat);
    }
    if (!angular.isUndefined($stateParams.idReservation)) {
      $scope.getReservationByIdBillet($stateParams.id, $stateParams.idReservation);
    }
    if (!angular.isUndefined($stateParams.idRestauration)) {
      $scope.getAchatByIdBillet($stateParams.id, $stateParams.idRestauration);
    }
    if (!angular.isUndefined($stateParams.idArchive)) {
      $scope.getArchiveByIdBillet($stateParams.id, $stateParams.idArchive);
    }
    if (!angular.isUndefined($stateParams.id_transfert)) {
      $scope.getTransfertByIdBillet($stateParams.id, $stateParams.id_transfert);
    }

    $scope.numToArray = function (quantite) {
      return new Array(quantite)
    };

    // This function verify if the id of a given purchase is in the list of scanned purchases
    $scope.achatInScan = function (Array, id) {
      var z = 0;
      for (z; z < Array.length; z++)
        if (Array[z].id == id) {
          //console.log('trouve');
          return z;
        }
      return -1;
    };

    // Template d'achat de tickets
    $ionicModal.fromTemplateUrl('transfertTicket.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModalTransfert = function (idBillet, type) {
      $scope.modal.show();
      $scope.idBillet = idBillet;
      $scope.typeAtransfert = type;
    };
    $scope.closeModalTransfert = function () {
      $scope.modal.hide();
    };

  });


