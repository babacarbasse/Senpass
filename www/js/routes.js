 angular.module('app')

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider


      .state('tabsController', {
        url: '/page1',
        templateUrl: 'templates/tabsController.html',
        abstract: true
      })

      .state('tabsController.homePage', {
        url: '/home',
        // cache: false,
        views: {
          'tab1': {
            templateUrl: 'templates/homePage.html',
            controller: 'homePageCtrl'/*,
            resolve: {
              billetsInformations: function (HomeService) {
                return HomeService.getBilletService();
              }
            }*/
          }
        }
      })
      .state('tabsController.searchPage', {
        url: '/search',
        // cache: false,
        views: {
          'tab1': {
            templateUrl: 'templates/search.html',
            controller: 'SearchController'
          }
        }
      })
      .state('tabsController.detailsBillet', {
        url: '/details/:id',
        views: {
          'tab1': {
            templateUrl: 'templates/Home/details.html',
            controller: 'HomeController'
          }
        }
      })

      .state('tabsController.homePageRestauration', {
        url: '/restauration',
        // cache: false,
        views: {
          'tab1': {
            templateUrl: 'templates/homePageRestauration.html',
            controller: 'homePageCtrl'/*,
            resolve: {
              billetsInformations: function (HomeService) {
                return HomeService.getBilletService();
              }
            }*/
          }
        }
      })
      .state('tabsController.detailsBilletRestauration', {
        url: '/detailsRestauration/:id',
        views: {
          'tab1': {
            templateUrl: 'templates/Home/detailsRestauration.html',
            controller: 'HomeController'
          }
        }
      })

      .state('tabsController.messagePage', {
        url: '/message',
        views: {
          'tab22': {
            templateUrl: 'templates/messagePage.html',
            controller: 'messagePageCtrl'
          }
        }
      })
      .state('tabsController.detailMessage', {
        url: '/message/:id',
        views: {
          'tab22': {
            templateUrl: 'templates/Message/message.html',
            controller: 'MessageController'
          }
        }
      })


      .state('tabsController.accountPage', {
        url: '/account',
        views: {
          'tab3': {
            templateUrl: 'templates/accountPage.html',
            controller: 'accountPageCtrl'
          }
        }
      })
      .state('tabsController.achats', {
        url: '/achats',
        views: {
          'tab3': {
            templateUrl: 'templates/Account/achats.html',
            controller: 'AccountController'
          }
        }
      })
      .state('tabsController.detailsAchats', {
        url: '/detailAchat/:id/:idAchat',
        views: {
          'tab3': {
            templateUrl: 'templates/Account/detailAchat.html',
            controller: 'AccountController'
          }
        }
      })
      .state('tabsController.reservations', {
        url: '/reservations',
        views: {
          'tab3': {
            templateUrl: 'templates/Account/reservations.html',
            controller: 'AccountController'
          }
        }
      })
      .state('tabsController.detailsReservations', {
        url: '/detailReservation/:id/:idReservation',
        views: {
          'tab3': {
            templateUrl: 'templates/Account/detailReservation.html',
            controller: 'AccountController'
          }
        }
      })
      .state('tabsController.transferts', {
        url: '/transferts',
        views: {
          'tab3': {
            templateUrl: 'templates/Account/transferts.html',
            controller: 'AccountController'
          }
        }
      })
      .state('tabsController.detailsTransfert', {
        url: '/detailTransfert/:id/:id_transfert',
        views: {
          'tab3': {
            templateUrl: 'templates/Account/detailsTransfert.html',
            controller: 'AccountController'
          }
        }
      })
      .state('tabsController.restauration', {
        url: '/restauration',
        views: {
          'tab3': {
            templateUrl: 'templates/Account/restaurations.html',
            controller: 'AccountController'
          }
        }
      })
      .state('tabsController.detailsRestauration', {
        url: '/detailsRestauration/:id/:idRestauration',
        views: {
          'tab3': {
            templateUrl: 'templates/Account/detailsRestauration.html',
            controller: 'AccountController'
          }
        }
      })
      .state('tabsController.archives', {
        url: '/archives',
        views: {
          'tab3': {
            templateUrl: 'templates/Account/archives.html',
            controller: 'AccountController'
          }
        }
      })
      .state('tabsController.detailsArchives', {
        url: '/detailArchive/:id/:idArchive',
        views: {
          'tab3': {
            templateUrl: 'templates/Account/detailsArchive.html',
            controller: 'AccountController'
          }
        }
      })


      .state('tabsController.soldeScan', {
        url: '/soldeScan',
        views: {
          'tab33': {
            cache: false,
            templateUrl: 'templates/soldeScan.html',
            controller: 'ScannerController',
            resolve: {
              scanInformations: function (ScannerService) {
                //alert(localStorage.getItem("dateReset"));
                return ScannerService.getScanService(localStorage.getItem("idUser"), localStorage.getItem("dateReset"));
              }
            }
          }
        }
      })
      .state('tabsController.scan', {
        url: '/scan',
        cache: false,
        views: {
          'tab2': {
           // templateUrl: 'templates/scan.html',
            controller: 'ScanController'
          }
        }
      })

      .state('tabsController.publicitePage', {
        url: '/publicite',
        views: {
          'tab5': {
            templateUrl: 'templates/publicitePage.html',
            controller: 'publicitePageCtrl'
          }
        }
      })
      .state('tabsController.detailPublicite', {
        url: '/publicite/:id',
        views: {
          'tab5': {
            templateUrl: 'templates/Publicite/publicite.html',
            controller: 'PubliciteController'
          }
        }
      })


      .state('tabsController.plusPage', {
        url: '/plus',
        views: {
          'tab4': {
            templateUrl: 'templates/plusPage.html',
            controller: 'plusPageCtrl'
          }
        }
      })
      .state('tabsController.informationsPerso', {
        url: '/personal',
        views: {
          'tab4': {
            templateUrl: 'templates/Plus/informationsPerso.html',
            controller: 'PlusController'
          }
        }
      })


      .state('login', {
        url: '/page6',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      })
      .state('logout', {
        url: 'logout',
        templateUrl: 'templates/login.html',
        controller: "logoutCtrl"
      });

    $urlRouterProvider.otherwise('page6')


  });
