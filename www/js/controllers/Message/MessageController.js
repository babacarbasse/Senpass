/**
 * Created by lakhassane on 13/04/2016.
 */

angular.module('app')

  .controller('MessageController', function ($scope, Store, $state, $ionicPopover, $stateParams, MessageService) {

    var id = $stateParams.id;

    $scope.idUser = localStorage.getItem( 'idUser' );
    $scope.discussion = '';
    $scope.Messages = [];

    $scope.reponse = '';

    for (var i = 0; i < Store.getDiscussion().length; i++) {
      if (Store.getDiscussion()[i].id == $stateParams.id) {
        $scope.discussion = Store.getDiscussion()[i];
        break;
      }
    }

    $scope.deleteMessage = function( id ) {
      MessageService.deleteMessageService( id )
        .then(function ( res ) {
          console.log("suppression message");
          console.log(res);
          $scope.closePopover();
          $state.go("tabsController.detailMessage({ id: discussion.id })", {}, {reload: true});

        }, function( error ) {
          console.log( error );
        })
    };

    $scope.sendMessage = function( reponse, idDiscussion ) {
      $scope.discussion.message.push({
        contenu: reponse,
        auteur: {
          id: $scope.idUser
        },
        date_envoie: new Date()
      });
      $scope.reponse = '';
      MessageService.sendMessageService ( reponse, idDiscussion )
        .then( function( res ) {
          console.log(res);
        }, function ( error ) {
          console.log(error);
        });
    };

    var template = '<ion-popover-view><ion-header-bar> ' +
      '<h1 class="title">Actions</h1> </ion-header-bar> <ion-content> Hello! ' +
      '</ion-content>' +
      '</ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });

    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('my-popover.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.popover = popover;
    });


    $scope.openPopover = function($event, idDelete) {
      $scope.toDelete = idDelete;
     // alert("id : " + $scope.toDelete);
      $scope.popover.show($event);
    };
    $scope.closePopover = function() {
      $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.popover.remove();
    });
    // Execute action on hidden popover
    $scope.$on('popover.hidden', function() {
      // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
      // Execute action
    });

  });
