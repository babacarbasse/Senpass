/**
 * Created by lakhassane on 13/04/2016.
 */

angular.module('app')

  .service('MessageService', function ($http, $rootScope, config) {

    return {

      getPubliciteService: function () {
        return $http.get(config.URL + "/api/publicites")
          .then(function (res) {
            console.log(res);
            return res.data;
          }, function (error) {
            console.log(error);
            return error.data;
          })
      },

      getMessageByParticipant: function (id) {
        $rootScope.loadingDone = 0;
        return $http.get(config.URL + "/api/discussions/" + localStorage.getItem('authorizationToken')
          + "/users/" + id)
          .then(function (res) {
            $rootScope.loadingDone = 1;
            console.log(res);
            return res.data;
          }, function (error) {
            return error.data;
          })
      },

      deleteDiscussionService: function( id ) {
        return $http.get(config.URL + "/api/bloquers/"+ localStorage.getItem("authorizationToken") + "/discussions/" +id)
          .then( function ( res ) {
            console.log(res);
            return res.data;
          }, function ( error ) {
            return error.data;
          })
      },

      deleteMessageService: function( id ) {
        return $http.get(config.URL + "/api/bloquers/"+ localStorage.getItem("authorizationToken") + "/messages/" +id)
          .then( function ( res ) {
            console.log(res);
            return res.data;
          }, function ( error ) {
            return error.data;
          })
      },

      sendMessageService: function( message, discussion ) {
        return $http.post(config.URL + "/api/replies/"+ localStorage.getItem("authorizationToken") + "/messages",
                              {discussion: discussion, message: message})
          .then( function ( res ) {
            return res.data;
          }, function ( error ) {
            console.log(error);
            return error.data;
          })
      },

      readMessageService: function( message ) {
        return $http.post(config.URL + "/api/reads/"+ localStorage.getItem("authorizationToken") + "/messages",
          { message: message.id })
          .then( function ( res ) {
            return res.data;
          }, function ( error ) {
            console.log(error);
            return error.data;
          })
      },

      getImageBillet: function (id) {
        return $http.get(config.URL + "/api/images/" + id)
          .then(function (res) {
            return res.data;
          }, function (error) {
            console.log(error);
            return error.data;
          })
      }

    }

  });

