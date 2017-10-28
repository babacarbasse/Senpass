/**
 * Created by lakhassane on 16/03/2016.
 */

angular.module('app')

  .service('plusPageService', function ($http, config) {

    return {

      getCategorieService: function () {
        return $http.get(config.URL + "/api/categories/"+localStorage.getItem('authorizationToken'))
          .then(function (res) {
            return res.data;
          }, function (error) {
            console.log(error);
            return error.data
          })
      },

      savePersonalInfosService: function (informationsUser, informationsClient) {
        //return $http.post(config.url + "/api/majs/" + informationsClient.id)
        return $http({
          method: "POST",
          url: config.URL + "/api/majs/"+ localStorage.getItem('authorizationToken')+ "/users/" + informationsClient.id,
          data: {
            prenom: informationsClient.prenom,
            nom: informationsClient.nom,
            email: informationsUser.email,
            adresse: informationsClient.adresse
          }
        })
          .then(function (res) {
            return res.data;
          }, function (error) {
            console.log(error);
          })
      }
    }

  });

