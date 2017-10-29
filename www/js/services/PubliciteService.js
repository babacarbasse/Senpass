/**
 * Created by lakhassane on 07/06/2016.
*/

angular.module('app')

  .service('PubliciteService', function($http, config, $rootScope){

    return {

      getPubliciteService: function(){
        $rootScope.loadingDone = 0;
        return $http.get(config.URL + "/api/publicites/" + localStorage.getItem('authorizationToken'))
          .then(function(res) {
            $rootScope.loadingDone = 1;
            console.log(res);
            return res.data;
          }, function(error){
            $rootScope.loadingDone = 1;
            console.log(error);
            return error.data;
          })
      },

      getPubliciteServiceSn: function(){
        $rootScope.loadingDone = 0;
        return $http.get(config.URL + "/api/publicites/" + localStorage.getItem('authorizationToken') + "/pays/sn")
          .then(function(res) {
            $rootScope.loadingDone = 1;
            console.log(res);
            return res.data;
          }, function(error){
            $rootScope.loadingDone = 1;
            console.log(error);
            return error.data;
          })
      },

      getPubliciteServiceCi: function(){
        $rootScope.loadingDone = 0;
        return $http.get(config.URL + "/api/publicites/" + localStorage.getItem('authorizationToken') + "/pays/ci")
          .then(function(res) {
            $rootScope.loadingDone = 1;
            console.log(res);
            return res.data;
          }, function(error){
            $rootScope.loadingDone = 1;
            console.log(error);
            return error.data;
          })
      },

      getPubliciteByIdService: function(id) {
        return $http.get(config.URL + "/api/publicites/"  + localStorage.getItem('authorizationToken')+ "/ids/" + id)
          .then(function(res) {
            console.log(res);
            return res.data;
          }, function(error){
            console.log(error);
            return error.data;
          })
      }

    }

  });

