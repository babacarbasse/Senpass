/**
 * Created by lakhassane on 27/07/2016.
 */

angular.module('app')

  .service('ScannerService', function ($http, config) {

    return {
      /*postScanService: function (qrcode) {
        return $http.post(config.URL + "/api/scans/" + localStorage.getItem('authorizationToken'), qrcode)
          .then(function (res) {
            alert("appel au scanner effectué");
            console.log(res.data);
            return res.data;
          }, function (error) {
            alert("appel au scanner non effectué");
            console.log(error);
            alert(JSON.stringify(error));
            return error.data
          })
      },*/
      postScanService: function (qrcode) {
        return $http.post(config.URL + "/api/scans/" + localStorage.getItem('authorizationToken'), qrcode)
          .success(function (res) {
            // alert("appel au scanner effectué");
            console.log(res);
            return res;
          })
          .error(function (error) {
            // alert("appel au scanner non effectué");
            console.log(error);
            return error.data
          });
      },

      getScanService: function(id_user, date) {
        return $http.get(config.URL + "/api/scans/" + localStorage.getItem('authorizationToken') + "/dates/" + date)
          .then(function (res) {
            console.log(res.data);
            return res.data;
          }, function (error) {
            console.log(qrcode);
            console.log(error.data);
            return error.data
          })
      }
    }

  }
);

