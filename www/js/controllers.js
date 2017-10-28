angular.module('app')

  .controller('homePageCtrl', function ($rootScope, $scope, $state, Store,$ionicPlatform, $http,
                                        HomeService, plusPageService, LoginService, /*billetsInformations,*/ ScannerService) {

    $scope.qrcode = {
      qrcode: ''
    };
    $scope.scannn = function () {
      console.log('scan');
      $scope.qrcode.qrcode = "$2y$10$5808df1e2da028.850713ulEcoY1dRrnUJ2210q2G4BEFuzt8KYgO";
      ScannerService.postScanService($scope.qrcode)
        .then(function (res) {
          console.log('resultat  : ' + res);
          //$rootScope.scann();
        }, function (err) {
          console.log(err);
        });
    };

    $scope.Billets = [];
    $scope.BilletsRestaurants = [];
    $scope.Images = [];
    $scope.Categories = [];

    $scope.category = {
      id: '',
      libelle: '',
      description: ''
    };

    $scope.doSearch = function (){
      $state.go('tabsController.searchPage');
    };

    $scope.getBillets = function () {
      if (Store.getUserLocation() === '') {
        HomeService.getCountryCodeFromIpAdress()
        .then(function (res) {
            console.log('====================================');
            console.log(res);
            console.log('====================================');
            Store.setUserLocation(res);
            $scope.performGetBillets();
        });
      } else {
          $scope.performGetBillets();
      }
    };

    $scope.performGetBillets = function () {
      if (Store.getUserLocation() === 'SN') {
        HomeService.getBilletSNService()
          .then(function (res) {
            $scope.saveBillets(res);
            Store.setBillet($scope.Billets); // Penser à conserver les billets localement aussi plutôt qu'ici.
            Store.setBilletRestaurant($scope.BilletsRestaurants); // Penser à conserver les billets localement aussi plutôt qu'ici.
            //console.log("Billet"); // Penser à conserver les billets localement aussi plutôt qu'ici.
            //console.log($scope.Billets); // Penser à conserver les billets localement aussi plutôt qu'ici.
            Store.setImage($scope.Images);
            if ($scope.Billets.length === 0) {
              $scope.nombreBillets = 0;
              $scope.messageBillets = "Pas de billets disponibles.";
            } else {
              $scope.nombreBillets = 1;
            }

            if ($scope.BilletsRestaurants.length === 0) {
              $scope.nombreBilletsRestaurants = 0;
              $scope.messageBilletsRestaurants = "Pas de billets disponibles.";
            } else {
              $scope.nombreBilletsRestaurants = 1;
            }
          }, function (error) {

          });
      }

      if (Store.getUserLocation() === 'CIV') {
        HomeService.getBilletCIVService()
          .then(function (res) {
            $scope.saveBillets(res);
            Store.setBillet($scope.Billets); // Penser à conserver les billets localement aussi plutôt qu'ici.
            Store.setBilletRestaurant($scope.BilletsRestaurants); // Penser à conserver les billets localement aussi plutôt qu'ici.
            //console.log("Billet"); // Penser à conserver les billets localement aussi plutôt qu'ici.
            //console.log($scope.Billets); // Penser à conserver les billets localement aussi plutôt qu'ici.
            Store.setImage($scope.Images);
            if ($scope.Billets.length === 0) {
              $scope.nombreBillets = 0;
              $scope.messageBillets = "Pas de billets disponibles.";
            } else {
              $scope.nombreBillets = 1;
            }

            if ($scope.BilletsRestaurants.length === 0) {
              $scope.nombreBilletsRestaurants = 0;
              $scope.messageBilletsRestaurants = "Pas de billets disponibles.";
            } else {
              $scope.nombreBilletsRestaurants = 1;
            }
          }, function (error) {

          });
      }

      if (Store.getUserLocation() === 'UNDEFINED') {
          $scope.nombreBillets = 0;
          $scope.messageBillets = "Pas de billets disponibles pour votre localisation actuelle.";
      }
    };


    $scope.saveBillets = function(res) {
      for (var i = 0; i < res.length; i++) {
        if (!angular.isUndefined(res[i].categorie.type) && res[i].categorie.type !== "Universitaire") {
          $scope.Billets.push({
            id: res[i].id,
            libelle: res[i].libelle,
            code: res[i].code,
            lieu: res[i].lieu,
            region: res[i].region,
            ville: res[i].ville,
            is_free: res[i].is_free,
            gerant: res[i].gerant,
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
        } else {
          $scope.BilletsRestaurants.push({
            id: res[i].id,
            libelle: res[i].libelle,
            code: res[i].code,
            lieu: res[i].lieu,
            region: res[i].region,
            ville: res[i].ville,
            is_free: res[i].is_free,
            gerant: res[i].gerant,
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
      }
    };

    $scope.getCategorie = function () {
      plusPageService.getCategorieService()
        .then(function (res) {
          if (res.echec) {
            $state.go('login');
          }
          else {
            for (var i = 0; i < res.length; i++) {
              if ($rootScope.etudiant === 0) {
                if (res[i].type !== "Universitaire") {
                  $scope.Categories.push({
                    id: res[i].id,
                    libelle: res[i].libelle,
                    type: res[i].type
                  });
                }
              } else {
                $scope.Categories.push({
                  id: res[i].id,
                  libelle: res[i].libelle,
                  type: res[i].type
                });
              }
            }
            $scope.Categories.push({
              id: 100, // Il enregistre un libelle avec comme id = 100 pour le libellé TOUT /** pas optimal **/.
              libelle: "Tout",
              type: "inconnu"
            });
          }
        });

    };

    $scope.reloadBillets = function () {
      if (Store.getUserLocation() === '') {
        HomeService.getCountryCodeFromIpAdress()
        .then(function (res) {
            Store.setUserLocation(res);
            $scope.performReloadBilletsByCategorie();
        });
      } else {
          $scope.performReloadBilletsByCategorie();
      }
    };

    $scope.performReloadBilletsByCategorie = function() {
      if (Store.getUserLocation() === 'SN') {
        HomeService.getBilletSNByCategorieService($scope.category.id)
        .then(function (res) {
          if (!angular.isUndefined(res)) {
            for (var i = 0; i < res.length; i++) {
              $scope.Billets.push({
                id: res[i].id,
                libelle: res[i].libelle,
                lieu: res[i].lieu,
                region: res[i].region,
                code: res[i].code,
                ville: res[i].ville,
                is_free: res[i].is_free,
                gerant: res[i].gerant,
                date_expiration: res[i].date_expiration,
                type_billet: res[i].typebillets,
                description: res[i].description,
                image: res[i].image.id + "." + res[i].image.chemin,
                surchage_paypal: res[i].surchage_paypal,
                commission_om: res[i].commission_om,
                commission_paypal: res[i].commission_paypal,
                commission_wari: res[i].commission_wari,
                taux_the_commission: res[i].taux_the_commission
                /*imageId: HomeService.getImageBillet(res[i].image.id)
                 .then(function (res) {
                 $scope.Images.push({
                 image: res
                 });
                 })*/
              });
            }
            if ($scope.Billets.length == 0) {
              $scope.nombreBillets = 0;
              $scope.messageBillets = "Pas de billets pour cette catégorie.";
            } else {
              $scope.nombreBillets = 1;
            }
          }
        });
      }

      if (Store.getUserLocation() === 'CIV') {
        HomeService.getBilletCIVByCategorieService($scope.category.id)
        .then(function (res) {
          if (!angular.isUndefined(res)) {
            for (var i = 0; i < res.length; i++) {
              $scope.Billets.push({
                id: res[i].id,
                libelle: res[i].libelle,
                lieu: res[i].lieu,
                code: res[i].code,
                region: res[i].region,
                ville: res[i].ville,
                is_free: res[i].is_free,
                gerant: res[i].gerant,
                date_expiration: res[i].date_expiration,
                type_billet: res[i].typebillets,
                description: res[i].description,
                image: res[i].image.id + "." + res[i].image.chemin,
                surchage_paypal: res[i].surchage_paypal,
                commission_om: res[i].commission_om,
                commission_paypal: res[i].commission_paypal,
                commission_wari: res[i].commission_wari,
                taux_the_commission: res[i].taux_the_commission
                /*imageId: HomeService.getImageBillet(res[i].image.id)
                 .then(function (res) {
                 $scope.Images.push({
                 image: res
                 });
                 })*/
              });
            }
            if ($scope.Billets.length == 0) {
              $scope.nombreBillets = 0;
              $scope.messageBillets = "Pas de billets pour cette catégorie.";
            } else {
              $scope.nombreBillets = 1;
            }
          }
        });
      }

      if (Store.getUserLocation() === 'UNDEFINED') {
        $scope.nombreBillets = 0;
        $scope.messageBillets = "Pas de billets pour cette catégorie.";
      }
    }

    $scope.idCategoryChange = function () {
      $scope.Billets = [];
      $scope.Images = [];
      if ($scope.category.id == 100) {
        $scope.getBillets();
      } else {
        $scope.reloadBillets();
      }
    };

    $scope.getTicketRestaurants = function () {
      for (var i = 0; i < billetsInformations.length; i++) {
        if (billetsInformations[i].categorie.type === "Universitaire")
          $scope.BilletsRestaurants.push({
            surchage_paypal: billetsInformations[i].surchage_paypal,
            commission_om: billetsInformations[i].commission_om,
            commission_paypal: billetsInformations[i].commission_paypal,
            commission_wari: billetsInformations[i].commission_wari,
            taux_the_commission: billetsInformations[i].taux_the_commission,
            code: billetsInformations[i].code,
            id: billetsInformations[i].id,
            libelle: billetsInformations[i].libelle,
            lieu: billetsInformations[i].lieu,
            region: billetsInformations[i].region,
            ville: billetsInformations[i].ville,
            is_free: billetsInformations[i].is_free,
            gerant: billetsInformations[i].gerant,
            date_expiration: billetsInformations[i].date_expiration,
            description: billetsInformations[i].description,
            image: billetsInformations[i].image.id + "." + billetsInformations[i].image.chemin
          });
      }
    };

    // Check whether it's a student or non
    $scope.getUserIdentity = function () {
      $rootScope.etudiant = 0;
      $rootScope.infosEtudiant = '';
      console.log('executing');
      LoginService.getInformationsClientService(localStorage.getItem("idUser"))
        .then(function (res) {
          if (!angular.isUndefined(res.client.etudiant)) {
            $rootScope.etudiant = 1;
            $rootScope.infosEtudiant = res.client.etudiant;
          }
          //localStorage.setItem("idClient", res[0].id);
          console.log("etudiant : " + $rootScope.etudiant);
          console.log(localStorage.getItem("idClient"));
        }, function (error) {
          console.log(error);
        })
    };

    $scope.refresh = function () {
      $scope.Billets = [];
      $scope.BilletsRestaurants = [];
      $scope.getBillets();
      $scope.$broadcast('scroll.refreshComplete');
    };


    $scope.getUserIdentity();
    $scope.getBillets();
    $scope.getCategorie();

  })

  .controller('homePageRestaurationCtrl', function ($rootScope, $scope, $state, Store,
                                                    HomeService, plusPageService, LoginService, billetsInformations) {
    $scope.Billets = [];
    $scope.Images = [];
    $scope.Categories = [];

    $scope.category = {
      id: '',
      libelle: '',
      description: ''
    };

    // CHANGE ALL THOSE FUNCTIONS BY THE API'S FOR RESTAURATION

    $scope.getBillets = function () {
      /*  HomeService.getBilletService()
       .then(function (res) {*/
      //   console.log(billetsInformations[1].is_free);
      for (var i = 0; i < billetsInformations.length; i++) {
        $scope.Billets.push({
          id: billetsInformations[i].id,
          libelle: billetsInformations[i].libelle,
          lieu: billetsInformations[i].lieu,
          region: billetsInformations[i].region,
          ville: billetsInformations[i].ville,
          is_free: billetsInformations[i].is_free,
          gerant: billetsInformations[i].gerant,
          date_expiration: billetsInformations[i].date_expiration,
          description: billetsInformations[i].description,
          image: billetsInformations[i].image.id + "." + billetsInformations[i].image.chemin
          /*,
           imageId: HomeService.getImageBillet(res[i].image.id)
           .then(function (res) {
           $scope.Images.push({
           image: res
           });
           }) */
        });
      }

      Store.setBillet($scope.Billets); // Penser à conserver les billets localement aussi plutôt qu'ici.
      console.log($scope.Billets); // Penser à conserver les billets localement aussi plutôt qu'ici.
      Store.setImage($scope.Images);

      //  });

    };

    $scope.getCategorie = function () {
      plusPageService.getCategorieService()
        .then(function (res) {
          if (res.echec) {
            $state.go('login');
          }
          else {
            for (var i = 0; i < res.length; i++) {
              $scope.Categories.push({
                id: res[i].id,
                libelle: res[i].libelle,
                type: res[i].type
              });
            }
            $scope.Categories.push({
              id: 100, // Il enregistre un libelle avec comme id = 100 pour le libellé TOUT /** pas optimal **/.
              libelle: "Tout",
              type: "inconnu"
            });

            console.log($scope.Categories);
          }
        });

    };

    $scope.reloadBillets = function () {
      HomeService.getBilletByCategorieService($scope.category.id)
        .then(function (res) {
          if (!angular.isUndefined(res)) {
            for (var i = 0; i < res.length; i++) {
              $scope.Billets.push({
                id: res[i].id,
                libelle: res[i].libelle,
                lieu: res[i].lieu,
                region: res[i].region,
                ville: res[i].ville,
                is_free: res.is_free,
                gerant: res[i].gerant,
                date_expiration: res[i].date_expiration,
                description: res[i].description,
                image: res[i].image.id + "." + res[i].image.chemin
                /*imageId: HomeService.getImageBillet(res[i].image.id)
                 .then(function (res) {
                 $scope.Images.push({
                 image: res
                 });
                 })*/
              });
            }
          }
        });

    };

    $scope.idCategoryChange = function () {
      $scope.Billets = [];
      $scope.Images = [];
      if ($scope.category.id == 100) {
        $scope.getBillets();
      } else {
        $scope.reloadBillets();
      }
    };

    // Check whether it's a student or na
    $scope.getUserIdentity = function () {
      LoginService.getInformationsClientService(localStorage.getItem("idUser"))
        .then(function (res) {
          if (!angular.isUndefined(res.etudiant)) {
            $rootScope.etudiant = 1;
          }
        }, function (error) {

        })
    };

    $scope.refresh = function () {
      $scope.Billets = [];
      $scope.getBillets();
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.getBillets();
    $scope.getCategorie();
  })

  .controller('messagePageCtrl', function ($rootScope, $scope, $ionicPopover, MessageService, Store) {

    console.log('executing...');
    // On initialise la liste des messages à la liste des messages envoyés
    $scope.selectedIndex = 0;

    // This function verify if the libelle given is in the list of message
    $scope.notIn = function (Array, date_envoie) {
      var z = 0;
      for (z; z < Array.length; z++)
        if (Array[z].lastMessage.date_envoie == date_envoie) {
          // console.log('trouve');
          return z;
        }
      return -1;
    };

    $scope.getMyDiscussions = function (id) {
      $scope.DiscussionsInities = [];
      $scope.DiscussionsRecus = [];
      $rootScope.countSendUnread = 0;
      MessageService.getMessageByParticipant(id)
        .then(function (res) {
          $scope.DiscussionsRecus = [];
          for (var i = 0; i < res.length; i++) {
            if (res[i].expediteur.id == localStorage.getItem("idUser") &&
              $scope.notIn($scope.DiscussionsInities, res[i].messages[res[i].messages.length - 1].date_envoie) == -1) {
              if ( !res[i].messages[res[i].messages.length - 1].is_read ) {
                $rootScope.countSendUnread += 1;
              }
              $scope.DiscussionsInities.push({
                id: res[i].id,
                destinataire: res[i].destinataire,
                expediteur: res[i].expediteur,
                message: res[i].messages,
                lastMessage: res[i].messages[res[i].messages.length - 1],
                firstMessage: res[i].messages[0]
              })
            }
          }
          if ($scope.DiscussionsInities.length == 0) {
            $scope.nbreMessageInitie = 0;
            $scope.messageInfoInitie = "Vous n'avez pas de messages.";
          } else {
            $scope.nbreMessageInitie = 1;
          }
          Store.setDiscussion($scope.DiscussionsInities);
          console.log($scope.DiscussionsInities);
        }, function (error) {
          console.log(error);
        })
    };

    $scope.getMyDiscussionsRecus = function (id) {
      $scope.DiscussionsInities = [];
      $scope.DiscussionsRecus = [];
      $rootScope.countRecuUnread = 0;
      MessageService.getMessageByParticipant(id)
        .then(function (res) {
          $scope.DiscussionsInities = [];
          for (var i = 0; i < res.length; i++) {
            if (res[i].destinataire.id == localStorage.getItem("idUser") &&
              $scope.notIn($scope.DiscussionsRecus, res[i].messages[res[i].messages.length - 1].date_envoie) == -1) {
              if ( !res[i].messages[res[i].messages.length - 1].is_read ) {
                $rootScope.countRecuUnread += 1;
              }
              $scope.DiscussionsRecus.push({
                id: res[i].id,
                destinataire: res[i].destinataire,
                expediteur: res[i].expediteur,
                message: res[i].messages,
                lastMessage: res[i].messages[res[i].messages.length - 1],
                firstMessage: res[i].messages[0],
                lu: res[i].messages[res[i].messages.length - 1].is_read
              })
            }
          }
          if ($scope.DiscussionsRecus.length == 0) {
            $scope.nbreMessageRecus = 0;
            $scope.messageInfoRecu = "Vous n'avez pas de messages.";
          } else {
            $scope.nbreMessageRecus = 1;
          }
          Store.setDiscussion($scope.DiscussionsRecus);
          console.log($scope.DiscussionsRecus);
        }, function (error) {
          console.log(error);
        })
    };

    $scope.deleteDiscussion = function (id) {
      if ($scope.selectedIndex == 1) {
        for (var i = 0; i < $scope.DiscussionsInities.length; i++) {
          if ($scope.DiscussionsInities[i].id == id) {
            $scope.DiscussionsInities.splice(i, 1);
          }
        }
      } else {
        for (var j = 0; j < $scope.DiscussionsRecus.length; j++) {
          if ($scope.DiscussionsRecus[j].id == id) {
            $scope.DiscussionsRecus.splice(j, 1);
          }
        }
      }

      MessageService.deleteDiscussionService(id)
        .then(function (res) {
          console.log(res);
          if (res.echec == 0) {
            //$rootScope.showAlert("Message supprimé", "green");
            if ($scope.selectedIndex == 1) {
              //$scope.getMyDiscussionsRecus(localStorage.getItem("idUser"))
            } else {
              //$scope.getMyDiscussions(localStorage.getItem("idUser"))
            }
            $scope.$apply();
          }
        }, function (error) {
          console.log(error);
        })
    };

    $scope.readMessage = function( message  ) {
      if ( message.is_read ) {
        $scope.toUpdate = 0;
      } else {
        MessageService.readMessageService( message )
          .then( function ( res) {
            console.log( res );
            $rootScope.countRecuUnread -= 1;

          }, function( error ) {
            console.log( error );
          });
      }

    };

    var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });

    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('my-popover.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });


    $scope.openPopover = function ($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function () {
      $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.popover.remove();
    });
    // Execute action on hidden popover
    $scope.$on('popover.hidden', function () {
      // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
      // Execute action
    });

    $scope.buttonClicked = function (index) {
      $scope.selectedIndex = index;
      if ($scope.selectedIndex == 0) {
        $scope.getMyDiscussionsRecus(localStorage.getItem("idUser"))
      } else {
        $scope.getMyDiscussions(localStorage.getItem("idUser"))
      }
      $scope.$apply();
    };

    // $scope.getMyDiscussionsRecus(localStorage.getItem("idUser"));
  })

  .controller('accountPageCtrl', function ($rootScope, $scope) {


  })

  .controller('plusPageCtrl', function (Store, HomeService, $scope, $ionicModal) {
    // Template pour enregistrement code OTP

    // mettre un ionic enter view ici

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

    $scope.$on("$ionicView.beforeEnter", function (event, data) {
      $scope.noPhoto = 0;
      $scope.myAvatarUser = localStorage.getItem("avatar");
      console.log("avatar");
      console.log($scope.myAvatarUser);
      if ( $scope.myAvatarUser == null ) {
        $scope.noPhoto = 1;
      }
    });

    $scope.openContact = function () {
      $scope.openModalContact();
    };

    $scope.openAbout = function () {
      $scope.openModalAbout();
    };

    $ionicModal.fromTemplateUrl('contact.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModalContact = function () {
      $scope.modal.show();
    };
    $scope.closeModalContact = function () {
      $scope.modal.hide();
    };

    $ionicModal.fromTemplateUrl('about.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal2 = modal;
    });
    $scope.openModalAbout = function () {
      $scope.modal2.show();
    };
    $scope.closeModalAbout = function () {
      $scope.modal2.hide();
    };

  })

  .controller('loginCtrl', function ($http, config, $scope, $rootScope, $state, LoginService, MessageService, Store,$ionicPlatform) {

    $scope.credentials = {
      //username: "221",
      username: null,
      password: null
    };

    $scope.login = function (credentials) {
      LoginService.login(credentials);
    };
    $scope.inscrire = function () {
      window.open("https://www.sen-pass.com/register/", "_blank", "location=yes");
    };

    $scope.loginWith = function(choice) {
      if(choice === 'facebook') {
        $ionicPlatform.ready(function () {
          console.log('facebook login');
          var fbLoginSuccess = function (userData) {
            facebookConnectPlugin.api(userData.authResponse.userID+"/?fields=id,email,first_name,last_name,name,picture", ["user_birthday"],
              function onSuccess (result) {
                result.email = result.id + "@facebook" + ".facebook";
                if (result.email === null) {
                  result.email = result.id + "@facebook" + ".facebook";
                }
                if (result.first_name === null) {
                  result.first_name = result.id + ".facebook";
                }
                if (result.last_name === null) {
                  result.last_name = result.id + ".facebook";
                }
                var post = {
                  email: result.email,
                  username: result.id,
                  facebook_id: result.id,
                  facebook_token: userData.authResponse.accessToken,
                  prenom: result.first_name,
                  nom: result.last_name
                };
                $http.post(config.URL_REGISTER_WITH_FACEBOOK, post, {
                  headers: {'Content-Type': 'application/json'} 
                })
                .then(function(res) {
                  user = res.data;
                  var credential = {
                    username : '',
                    password : ''
                  };
                  if (user.echec === 2) {
                    credential.username = '+'+result.id+'_facebook';
                    credential.password = result.id+'_facebook';
                  } else {
                    credential.username = '+'+res.username;
                    credential.password = res.username;
                  }
                  LoginService.login(credential);
                }, function(err) {
                  console.log('====================================');
                  console.log(err);
                  console.log('====================================');
                });
              }, function onError (error) {
                console.error("Failed: ", error);
              }
            );
          }
          facebookConnectPlugin.login(["public_profile", "email"], fbLoginSuccess,
            function (error) {
              console.error(error)
            }
          );
        });
      }
      if(choice === 'google') {
        LoginService.googleLogin();
      }
    };

    $scope.$on('event:auth-loginRequired', function (e, rejection) {
      $state.go('login');
    });
    $scope.$on('event:auth-loginConfirmed', function () {
      $scope.credentials.password = '';
      if (localStorage.getItem("role") == 'null') {
        $state.go('tabsController.homePage');
      } else {
        $state.go('tabsController.soldeScan');
      }

      /* RECUPERATION MESSAGES -- DEBUT */
      console.log('executing...');
      // On initialise la liste des messages à la liste des messages envoyés
      $rootScope.selectedIndex = 0;

      // This function verify if the libelle given is in the list of message
      $rootScope.notIn = function (Array, date_envoie) {
        var z = 0;
        for (z; z < Array.length; z++)
          if (Array[z].lastMessage.date_envoie == date_envoie) {
            // console.log('trouve');
            return z;
          }
        return -1;
      };

      $rootScope.getMyDiscussions = function (id) {
        $rootScope.DiscussionsInities = [];
        $rootScope.DiscussionsRecus = [];
        $rootScope.countSendUnread = 0;
        MessageService.getMessageByParticipant(id)
          .then(function (res) {
            $rootScope.DiscussionsRecus = [];
            for (var i = 0; i < res.length; i++) {
              if (res[i].expediteur.id == localStorage.getItem("idUser") &&
                $rootScope.notIn($rootScope.DiscussionsInities, res[i].messages[res[i].messages.length - 1].date_envoie) == -1) {
                if ( !res[i].messages[res[i].messages.length - 1].is_read ) {
                  $rootScope.countSendUnread += 1;
                }
                $rootScope.DiscussionsInities.push({
                  id: res[i].id,
                  destinataire: res[i].destinataire,
                  expediteur: res[i].expediteur,
                  message: res[i].messages,
                  lastMessage: res[i].messages[res[i].messages.length - 1],
                  firstMessage: res[i].messages[0]
                })
              }
            }
            if ($rootScope.DiscussionsInities.length == 0) {
              $rootScope.nbreMessageInitie = 0;
              $rootScope.messageInfoInitie = "Vous n'avez pas de messages.";
            } else {
              $rootScope.nbreMessageInitie = 1;
            }
            Store.setDiscussion($rootScope.DiscussionsInities);
            console.log($rootScope.DiscussionsInities);
          }, function (error) {
            console.log(error);
          })
      };

      $rootScope.getMyDiscussionsRecus = function (id) {
        $rootScope.DiscussionsInities = [];
        $rootScope.DiscussionsRecus = [];
        $rootScope.countRecuUnread = 0;
        MessageService.getMessageByParticipant(id)
          .then(function (res) {
            $rootScope.DiscussionsInities = [];
            for (var i = 0; i < res.length; i++) {
              if (res[i].destinataire.id == localStorage.getItem("idUser") &&
                $rootScope.notIn($rootScope.DiscussionsRecus, res[i].messages[res[i].messages.length - 1].date_envoie) == -1) {
                if ( !res[i].messages[res[i].messages.length - 1].is_read ) {
                  $rootScope.countRecuUnread += 1;
                }
                $rootScope.DiscussionsRecus.push({
                  id: res[i].id,
                  destinataire: res[i].destinataire,
                  expediteur: res[i].expediteur,
                  message: res[i].messages,
                  lastMessage: res[i].messages[res[i].messages.length - 1],
                  firstMessage: res[i].messages[0],
                  lu: res[i].messages[res[i].messages.length - 1].is_read
                })
              }
            }
            if ($rootScope.DiscussionsRecus.length == 0) {
              $rootScope.nbreMessageRecus = 0;
              $rootScope.messageInfoRecu = "Vous n'avez pas de messages.";
            } else {
              $rootScope.nbreMessageRecus = 1;
            }
            Store.setDiscussion($rootScope.DiscussionsRecus);
            console.log($rootScope.DiscussionsRecus);
          }, function (error) {
            console.log(error);
          })
      };

      $rootScope.buttonClicked = function (index) {
        $rootScope.selectedIndex = index;
        if ($rootScope.selectedIndex == 0) {
          $rootScope.getMyDiscussionsRecus(localStorage.getItem("idUser"))
        } else {
          $rootScope.getMyDiscussions(localStorage.getItem("idUser"))
        }
        $rootScope.$apply();
      };

      $rootScope.getMyDiscussionsRecus(localStorage.getItem("idUser"));
      /* RECUPERATION MESSAGES -- FIN */

    });
    $scope.$on('event:auth-login-failed', function (e, status) {
      var error = "Echec de l'authentification.";
      if (status == 401) {
        error = "Login ou mot de passe invalide.";
      }
      //alert(error);
      $rootScope.showAlert(error, "red");
    });
    $scope.$on('event:auth-logout-complete', function () {
      $state.go('login', {}, {reload: true, inherit: false});
    });
  })

  .controller('logoutCtrl', function ($scope, $state, LoginService) {
    $scope.$on('$ionicView.enter', function () {
      LoginService.logout();
      $state.go('login');
    });
  })

  .controller('publicitePageCtrl', function ($scope, $rootScope, PubliciteService) {
    //$scope.eventBadge = "0";
    //$scope.Publicites = [];

    $scope.getPublicites = function () {
      PubliciteService.getPubliciteService()
        .then(function (res) {
          for (var i = 0; i < res.length; i++) {
            $scope.Publicites.push({
              id: res[i].id,
              titre: res[i].titre,
              date_affichage: res[i].date_affichage,
              date_expiration: res[i].date_expiration,
              description: res[i].description,
              image: res[i].image.id + "." + res[i].image.chemin
            });
          }
          $rootScope.eventBadge = res.length;
          console.log($scope.Publicites);
        });
    };

    //$scope.getPublicites();

  });
