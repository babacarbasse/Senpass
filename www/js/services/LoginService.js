/**
 * Created by lakhassane on 29/03/2016.
 */
// client ID 951266492359-gkotil002od0c09vp9p3biu8bge46h9h.apps.googleusercontent.com 
// code secret Client iX8y7DpDGMCmL7M5iWBQYtui 

angular.module('app')

  .service('LoginService', function ($http, $ionicPlatform, config, $rootScope, authService, pushNotificationService, $ionicLoading) {

    return {
      getInformationsUserService: function (id_user) {
        return $http.get(config.URL + "/api/users/"+ id_user + "/tokens/" + localStorage.getItem('authorizationToken'))
          .then(function(res) {
            return res.data;
          }, function (error) {
            console.log(error);
            return error.data
          })
      },

      getInformationsClientService: function (id_user) {
        return $http.get(config.URL + "/api/users/" + id_user + "/clients/" + localStorage.getItem('authorizationToken'))
          .then(function (res) {
            console.log(res);
            return res.data;
          }, function (error) {
            console.log(error);
            return error.data
          })
      },

      login: function (credentials) {

        $ionicLoading.show({
          template: 'Chargement...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        /*if ( credentials.username.substring(0, 3) == "221" || isNaN(Number(credentials.username)) ) {
          //alert("221 added");
        } else {
          credentials.username = "221"+credentials.username;
          //alert(credentials.username);
        }*/

        //(credentials.username;
        // credentials.username = "%2b" + credentials.username.substring(1);
        var username = credentials.username.substring(1);
        //alert(credentials.username);
        console.log(username);
        console.log(credentials.password);
        $http.get(config.URL + "/oauth/v2/token?username=" + username + "&password=" + credentials.password
                + "&grant_type=password&client_id=" + config.CLIENT_ID + "&client_secret=" + config.CLIENT_SECRET)
          .success(function (data, status, headers, configuration) {

            $http.defaults.headers.common.Authorization = "Bearer "+data.access_token;  // Step 1
            localStorage.setItem('authorizationToken', data.access_token);
            if ( data.access_token ) {
              $http.get(config.URL + "/api/users/"+username+"/infos/" + data.access_token)
                .success(function(content){
                  console.log("id user : " + content.id);
                  // Save Device Token to DB
                  //if( $rootScope.newToken == 1 ) {
                    pushNotificationService.saveTokenService()
                      .then(function( res ) {
                        console.log( res );
                      }, function( error ) {
                        console.log( error );
                      });
                  //}
                  console.log("token : " + data.access_token);
                  localStorage.setItem('idUser', content.id);
                  $http.get(config.URL + "/api/users/"+ content.id + "/tokens/" + data.access_token)
                    .success(function(infosUser) {
                      if( !angular.isUndefined(infosUser.image)) {
                        $rootScope.avatarUser = infosUser.image.id + "." + infosUser.image.chemin;
                        localStorage.setItem("avatar", $rootScope.avatarUser);
                      }
                      $rootScope.etudiant = 0;
                      if( !angular.isUndefined(infosUser.client) ) {
                        if ( !angular.isUndefined(infosUser.client.etudiant) ) {
                          $rootScope.etudiant = 1;
                          localStorage.setItem("NCE", infosUser.client.etudiant.n_c_e);
                        }
                        localStorage.setItem('idClient', infosUser.client.id);
                      } else {
                       // alert("undefined");
                      }
                      $rootScope.infosUser = infosUser;
                      //alert(JSON.stringify($rootScope.infosUser));
                      $rootScope.role = $rootScope.infosUser.roles[0] ? $rootScope.infosUser.roles[0] : 'null';
                      localStorage.setItem('role', $rootScope.role);
                      authService.loginConfirmed(data, function (configuration) {  // Step 2 & 3
                        configuration.headers.Authorization = data.access_token;
                        return configuration;
                      });
                      $ionicLoading.hide();
                      return data;
                    })
                    .error(function(error) {
                      console.log('infos erreur 1');
                      console.log(error);
                      $ionicLoading.hide();
                    })
                })
                .error(function(error) {
                  console.log('infos erreur 2');
                  console.log(error);
                  $ionicLoading.hide()
                });
            }
          })
          .error(function (data, status, headers, config) {
            $ionicLoading.hide();
                 console.log("error auth");
                 console.log(data);
            $rootScope.$broadcast('event:auth-login-failed', status);
          });
      },

      logout: function () {
        return $http.get(config.URL + "/api/deconnexions/"+localStorage.getItem("authorizationToken"), {}, {ignoreAuthModule: true})
          .then(function (res) {
            console.log(res);
            localStorage.removeItem("authorizationToken");
            localStorage.removeItem("idUser");
            localStorage.removeItem("role");
            localStorage.removeItem("idClient");
            localStorage.removeItem("NCE");
            localStorage.removeItem("avatar");
            localStorage.removeItem("myAvatar");
            delete $http.defaults.headers.common.Authorization;
            $rootScope.$broadcast('event:auth-logout-complete');
          }, function( error ) {
            console.log( error );
          });
      },

      facebookLogin: function() {
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
                if (user.echec === 2) {
                  return result.id+'_facebook';
                }
                return res.username;
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
      },

      googleLogin: function() {
        $ionicLoading.show({
          template: 'Chargement...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        $ionicPlatform.ready(function () {
          window.plugins.googleplus.login(
            {},
            function (user_data) {
                $ionicLoading.hide();
                console.log(JSON.stringify(user_data));
            },
            function (msg) {
                $ionicLoading.hide();
                console.log('ERROR LogGoogle: ',msg);
            }
          )
        });
      }

    }

  }
)
;

