/**
 * Created by aminit on 28/11/2016.
 */


angular.module('app')

  .service('pushNotificationService', function ($http, $rootScope, config) {

    return {

      saveTokenService: function () {
        //alert(localStorage.getItem("deviceToken"));
        return $http.post(config.URL + "/api/tokens/" + localStorage.getItem("authorizationToken")+"/saves",
          { token: localStorage.getItem("deviceToken") } )
          .then(function (res) {
            console.log(res);
            return res.data;
          }, function (error) {
            //console.log(error);
            return error.data;
          })
      }
    }
  });

