// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ionic.service.core', 'http-auth-interceptor', 'ngCordova', 'ti-segmented-control',
                          'intlpnIonic'])

  .run(function ($ionicPlatform, $state, $rootScope, ScannerService, PubliciteService, config, pushNotificationService,
                  $timeout, $ionicLoading, $ionicPopup, MessageService, Store, HomeService) {
    $ionicPlatform.ready(function () {

      var push = new Ionic.Push({
        "debug": true,
        "pluginConfig": {
          "ios": {
            "alert": true,
            "sound": true,
            "badge": true,
            "clearBadge": true
          },
          "android": {
            "alert": true,
            "sound": true,
            "badge": true,
            "clearBadge": true
          }
        }
      });

      push.register(function( token ) {
        $rootScope.newToken = 0;
        console.log("Device Token:", token.token);
        push.saveToken( token ); // persist the token in the ionic platform
        if ( localStorage.getItem("deviceToken") == null  ) {
          $rootScope.newToken = 1;
          localStorage.setItem("deviceToken", token.token);
        } else if ( localStorage.getItem("deviceToken") != token.token ) {
          $rootScope.newToken = 1;
          localStorage.removeItem("deviceToken");
          localStorage.setItem("deviceToken", token.token);
        }
      });

      if ( localStorage.getItem("dateReset") == null ) {
        $rootScope.day = new Date().getDate();
        $rootScope.year = new Date().getFullYear();
        $rootScope.month = new Date().getUTCMonth() + 1;
        $rootScope.hour = new Date().getHours();
        $rootScope.minute = new Date().getMinutes();
        $rootScope.seconde = new Date().getSeconds();

        $rootScope.dateReset = $rootScope.year + "-" + $rootScope.month + "-" + $rootScope.day + " " + $rootScope.hour + ":" + $rootScope.minute + ":" + $rootScope.seconde;
        localStorage.setItem("dateReset", $rootScope.dateReset);
      }

      // An alert dialog
      $rootScope.showAlert = function(message, color) {
        var alertPopup = $ionicPopup.alert({
          title: 'informations',
          template: '<span style="color:' + color + ';text-align: center">' + message + '</span>'
        });
      };

      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $rootScope.toState = toState.name;
      });

      /* RECUPERATION PUBLICITES -- DEBUT */
      $rootScope.Publicites = [];

      if (Store.getUserLocation() === '') {
        HomeService.getCountryCodeFromIpAdress()
        .then(function (res) {
            Store.setUserLocation(res);
            $rootScope.getPublicites();
        });
      } else {
          $rootScope.getPublicites();
      }

      $rootScope.getPublicites = function () {
        if (Store.getUserLocation() === 'SN') {
          PubliciteService.getPubliciteServiceSn()
          .then(function (res) {
            $rootScope.savePub(res);
          });
        }
  
        if (Store.getUserLocation() === 'CI') {
          PubliciteService.getPubliciteServiceCi()
          .then(function (res) {
            $rootScope.savePub(res);
          });
        }
  
        if (Store.getUserLocation() === 'UNDEFINED') {
           $rootScope.nombrePublicites = 0;
           $rootScope.messagePublicites = "Pas de publicités disponibles.";
        }
  
      };
  
      $rootScope.savePub = function (res) {
        for (var i = 0; i < res.length; i++) {
          $rootScope.Publicites.push({
            id: res[i].id,
            titre: res[i].titre,
            date_affichage: res[i].date_affichage,
            date_expiration: res[i].date_expiration,
            description: res[i].description,
            image: res[i].image.id + "." + res[i].image.chemin
          });
        }
        $rootScope.nbrePubs = res.length;
        console.log($rootScope.Publicites);
        if ($rootScope.Publicites.length == 0) {
          $rootScope.nombrePublicites = 0;
          $rootScope.messagePublicites = "Pas de publicités disponibles.";
        } else {
          $rootScope.nombrePublicites = 1;
        }
      }

      /*
      PubliciteService.getPubliciteService()
        .then(function (res) {
          for (var i = 0; i < res.length; i++) {
            $rootScope.Publicites.push({
              id: res[i].id,
              titre: res[i].titre,
              date_affichage: res[i].date_affichage,
              date_expiration: res[i].date_expiration,
              description: res[i].description,
              image: res[i].image.id + "." + res[i].image.chemin
            });
          }
          
        });
        */

      /* RECUPERATION PUBLICITES -- FIN */


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

      $rootScope.getMessageFromAdmin = function( ) {
        $rootScope.messageAdmin = 0;
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
      $rootScope.getMessageFromAdmin();
      /* RECUPERATION MESSAGES -- FIN */


      $rootScope.qrcode = {
        qrcode: ''
      };
      $rootScope.scann = function () {
        localStorage.setItem("reset", 0);
        //$rootScope.showAlert("Démarrage du scan", "blue");
       //scanner.scan(function ( barcodeData ) {
        cordova.plugins.barcodeScanner.scan(function ( barcodeData ) {
            alert(barcodeData.cancelled);
            if ( !barcodeData.cancelled ) {
              console.log(barcodeData.cancelled);
              $rootScope.qrcode.qrcode = JSON.stringify(barcodeData.text);
              //alert($rootScope.qrcode.qrcode);
              // From this point, we split the text we get from barcodeData
              //var array = $rootScope.qrcode.qrcode.split('.png');
              var code = $rootScope.qrcode.qrcode.split('"');
              //var code = array[0].split('"');
              $rootScope.qrcode.qrcode = code[1];
               //alert($rootScope.qrcode.qrcode);
              ScannerService.postScanService($rootScope.qrcode)
                .then(function (res) {
                  //alert('resultat  : ' + res.resultat);
                  if ( res.echec == 113 ) {
                    $rootScope.showAlert("Ce ticket est inconnu du système", "red");
                    //alert( 'Ce ticket est inconnu du système' );
                  } else if ( res.echec == 114 ) {
                    $rootScope.showAlert("Ce ticket a déjà été scanné", "red");
                    //alert( 'Ce ticket est inconnu du système' );
                  } else if ( res.echec == 115 ) {
                    $rootScope.showAlert("Vous n\'êtes pas autorisé à scanner ce ticket.", "red");
                    //alert( 'Ce ticket est inconnu du système' );
                  } else if ( res.echec == 4 ){
                    $rootScope.showAlert("La totalité des billets a été scannée !", "red");
                    //alert("La totalité des billets a été scanné !");
                  } else if ( res.echec == 116 ) {
                      $rootScope.showAlert("Ce billet provient d'un évènement passé !", "red");
                  } else {
                      $rootScope.showAlert("Scan effectué avec succès !", "green");
                    /*$timeout(function() {
                      $rootScope.scann();
                    }, 2000);*/
                  }
                }, function (err) {
                  console.log(err);
                });
            }
          }, function (error) {
            alert(JSON.stringify(error));
          },
          {
            "prompt": "Placer un QRCode dans le cadre"
          });
      };

      $rootScope.hideMessage = function () {
        if (localStorage.getItem("role") == 'null') {
          return "ng-show";
        }
        else {
          return "ng-hide";
        }
      };
      $rootScope.hideScanner = function () {
        if (localStorage.getItem("role") == 'null') {
          return "ng-hide";
        }
        else {
          return "ng-show";
        }
      };
      $rootScope.URL_IMAGE = config.URL_IMAGE;

      // Reset scanner
      $rootScope.resetSolde = function () {
        localStorage.removeItem("dateReset");
        $rootScope.day = new Date().getDate();
        $rootScope.year = new Date().getFullYear();
        $rootScope.month = new Date().getUTCMonth() + 1;
        $rootScope.hour = new Date().getHours();
        $rootScope.minute = new Date().getMinutes();
        $rootScope.seconde = new Date().getSeconds();

        $rootScope.Scans = [];
        $rootScope.nombreScans = 0;
        $rootScope.dateReset = $rootScope.year + "-" + $rootScope.month + "-" + $rootScope.day + " " + $rootScope.hour + ":" + $rootScope.minute + ":" + $rootScope.seconde;
        localStorage.setItem("dateReset", $rootScope.dateReset);
        $rootScope.showAlert("Scanner réinitialisé !", "green");
        //alert($scope.dateReset);
      };

      var authorized = false;

      if (localStorage.getItem("authorizationToken") == null) {
        $state.go('login', {}, {reload: true, inherit: false});
      } else {
        if (localStorage.getItem("role") == 'null') {
          $state.go('tabsController.homePage', {}, {reload: true, inherit: false});
        } else {
          $state.go('tabsController.soldeScan', {}, {reload: true, inherit: false});
        }
      }

      // AFFICHAGE CHARGEMENT
     /* $rootScope.$on('loading:show', function () {
        $ionicLoading.show({template: 'Chargement...'})
      })
      $rootScope.$on('loading:hide', function () {
        $ionicLoading.hide()
      })*/

    });
  })

  .config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($rootScope) {
      return {
        request: function (config) {
          $rootScope.$broadcast('loading:show')
          return config
        },
        response: function (response) {
          $rootScope.$broadcast('loading:hide')
          return response
        }
      }
    })
  })

  // .config(function($ionicCloudProvider) {
  //   $ionicCloudProvider.init({
  //     "core": {
  //       "app_id": "3d82e34f"
  //     },
  //     "auth": {
  //       "facebook": {
  //         "scope": ["public_profile", "email"]
  //       }
  //     }
  //   });
  // })

  .config(function ($httpProvider) {
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.get = {};
    $httpProvider.defaults.headers.patch = {};
  });
