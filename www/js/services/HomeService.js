/**
 * Created by lakhassane on 16/03/2016.
 */

/*Google map api Key: AIzaSyCL_ldWkYcviM4jEwjVs1BMKVRFRchL728 */


angular.module('app')

  .service('HomeService', function ($http, config, $rootScope, $ionicLoading, Store) {

    return {

      getCountryCodeFromIpAdress: function () {
        var json = 'http://ip-api.com/json';
        return $http.get(json).then(function(result) {
          if (result.data.countryCode == 'SN' || result.data.countryCode == 'CI') {
            //return 'CI';
            return result.data.countryCode;
          } else {
            return 'UNDEFINED';
          }
        }, function(err) {
          console.log(err);
          return 'UNDEFINED';
        });
      },

      getBilletSNService: function () {
        _url = config.URL + "/api/billets/" + localStorage.getItem('authorizationToken') + "/pays/sn";
        return $http.get(_url) 
          .then(function (res) {
            $rootScope.loadingDone = 1;
            console.log(res);
            return res.data;
          }, function (error) {
            console.log(error);
            return error.data;
          })
      },

      getBilletCIVService: function () {
        _url = config.URL + "/api/billets/" + localStorage.getItem('authorizationToken') + "/pays/ci";
        return $http.get(_url)
          .then(function (res) {
            $rootScope.loadingDone = 1;
            console.log(res);
            return res.data;
          }, function (error) {
            console.log(error);
            return error.data;
          })
      },

      getBilletService: function () {
        _url = config.URL + "/api/billets/" + localStorage.getItem('authorizationToken')
        return $http.get(_url)
          .then(function (res) {
            $rootScope.loadingDone = 1;
            console.log(res);
            return res.data;
          }, function (error) {
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
      },

      getBilletByCategorieService: function (id_category) {
        return $http.get(config.URL + "/api/billets/" + id_category + "/categories/" + localStorage.getItem('authorizationToken'))
          .then(function (res) {
            return res.data;
          }, function (error) {
            console.log(error);
            return error.data;
          })
      },

      getBilletSNByCategorieService: function (id_category) {
        _url = config.URL + "/api/billets/" + id_category + "/categories/" + localStorage.getItem('authorizationToken') + "/pays/sn";
        return $http.get(_url)
        .then(function (res) {
          return res.data;
        }, function (error) {
          console.log(error);
          return error.data;
        })
      },

      getBilletCIVByCategorieService: function (id_category) {
        _url = config.URL + "/api/billets/" + id_category + "/categories/" + localStorage.getItem('authorizationToken') + "/pays/ci";
        return $http.get(_url)
        .then(function (res) {
          return res.data;
        }, function (error) {
          console.log(error);
          return error.data;
        })
      },

      getTypesBilletService: function (id_billet) {
        $rootScope.loadingDone = 0;
        return $http.get(config.URL + "/api/billets/" + id_billet + "/types/" + localStorage.getItem('authorizationToken'))
          .then(function (res) {
            $rootScope.loadingDone = 1;
            return res.data;
          }, function (error) {
            console.log(error);
            return error.data;
          })
      },

      buyTicketService: function (informationsBillets, infosBancaire, somme, idTransaction, idBillet) {
        $ionicLoading.show({
          template: 'Chargement...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        return $http.get("https://www.wariglobalpay.com/testpayementws/auth/" + config.USERNAME + "/" + config.PASS + "/fr")
          .then(function (resultat) {
            $rootScope.somme = somme;
                console.log('resultat : ');
                console.log(resultat);
            localStorage.setItem("statusMessage", resultat.data.statusMessage);
            if (resultat.data.statusCode == "000") {
              return $http.get('http://ipv4.myexternalip.com/json')
                .then(function(adressIP) {
                  console.log("adressIp : " + adressIP.data.ip);
                  return $http({
                    method: "POST",
                    url: "https://www.wariglobalpay.com/testpayementws/payment",
                    headers: {
                      'Content-Type': 'application/json', 'sessionId': resultat.data.statusMessage,
                      'clientId': config.USERNAME
                    },
                    data: {
                      requestID: idTransaction, marchand: "58730", cardnumber: infosBancaire.cardnumber, typePay: "mobile",
                      typecard: infosBancaire.typecard, cvv: infosBancaire.cvv, mnt: somme,
                      expiredate: infosBancaire.annee+""+infosBancaire.mois, clientIp: adressIP.data.ip,
                      urlReturn: "https://www.sen-pass.com/resultat-paiement/"+idTransaction, meansType: "carte",
                      Lastname: infosBancaire.lastname, Firstname: infosBancaire.firstname,
                      email: infosBancaire.email
                    }
                  })
                    .then(function (res) {
                      $ionicLoading.hide();
                      console.log('resultat 2');
                          console.log(res);
                      return res.data;
                    }, function (error) {
                      $ionicLoading.hide();
                      alert('error 1');
                      console.log(error);
                      return error.data;
                    })
                })
            } else {
              $ionicLoading.hide();
              alert("Cette opération n'est pas encore pris en compte.");
            }
          }, function (error) {
            $ionicLoading.hide();
          })
      },

      getInfoOperateurService: function() {
        return $http.post(config.URL + "/api/operateurs/" + localStorage.getItem("authorizationToken"), {montant: 10, transaction: "lakhassane"})
          .then( function ( res ) {
           // console.log( res );
            return res.data;
          }, function( error ) {
            console.log( error );
            return error.data;
          })
      },

      registerOTPAndPurchaseService: function (informationsBillets, OTP, idBillet) {
        $ionicLoading.show({
          template: 'Chargement...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        return $http({
          method: "POST",
          url: "https://www.wariglobalpay.com/testpayementws/otpvalidate",
          headers: {
            'Content-Type': 'application/json', 'sessionId': localStorage.getItem("statusMessage"),
            'clientId': config.USERNAME
          },
          data: { otp: OTP.otp, transID: OTP.transid }
        })
          .then(function (resultat) {
            console.log(resultat);
                $ionicLoading.hide();
            return resultat.data;
          }, function(error) {
            $ionicLoading.hide();
            console.log(error);
          })
      },

      buyTicketWariService: function (informationsBillets, somme, idBillet) {
        $ionicLoading.show({
          template: 'Achat en cours...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        return $http({
          method: "POST",
          url: config.URL + "/api/achats/" + localStorage.getItem('authorizationToken') + "/tickets/" + idBillet,
          data: {
            numero: informationsBillets.numero, typeBillet: informationsBillets.typeBillet,
            nbreTicket: informationsBillets.nbreTicket, transID: null, montant: somme,
            operateur: "WARI"
          }
        })
          .then(function (res) {
            console.log(res);
            $ionicLoading.hide();
            return res.data;
          }, function (error) {
            console.log(error);
            $ionicLoading.hide();
            return error.data;
          });
      },

      buyTicketCBService: function (informationsBillets, somme, idBillet) {
        $ionicLoading.show({
          template: 'Achat en cours...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        return $http({
          method: "POST",
          url: config.URL + "/api/achats/" + localStorage.getItem('authorizationToken') + "/tickets/" + idBillet,
          data: {
            numero: informationsBillets.numero, typeBillet: informationsBillets.typeBillet,
            nbreTicket: informationsBillets.nbreTicket, transID: null, montant: somme,
            operateur: "WARI" // à changer
          }
        })
          .then(function (res) {
            console.log(res);
            $ionicLoading.hide();
            return res.data;
          }, function (error) {
            console.log(error);
            $ionicLoading.hide();
            return error.data;
          });
      },

      buyTicketOMService: function ( informationsBillets, infosBancaireOM, somme, idBillet) { 
        $ionicLoading.show({
          template: 'Achat en cours...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        return $http({
          method: "POST",
          url: config.URL + "/api/achats/" + localStorage.getItem('authorizationToken') + "/tickets/" + idBillet,
          data: {
            numero: informationsBillets.numero, typeBillet: informationsBillets.typeBillet,
            nbreTicket: informationsBillets.nbreTicket, transID: null, montant: somme,
            operateur: "orange"
          }
        })
          .then(function (res) {
            $ionicLoading.hide();
            console.log(res);
            return res.data;
          }, function (error) {
            $ionicLoading.hide();
            console.log(error);
            return error.data;
          });
      },

      buyTicketOMCIService: function ( informationsBillets, somme, idBillet) {
        $ionicLoading.show({
          template: 'Achat en cours...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        return $http({
          method: "POST",
          url: config.URL + "/api/achats/" + localStorage.getItem('authorizationToken') + "/tickets/" + idBillet,
          data: {
            numero: informationsBillets.numero, typeBillet: informationsBillets.typeBillet,
            nbreTicket: informationsBillets.nbreTicket, transID: null, montant: somme,
            operateur: "orangeci"
          }
        })
          .then(function (res) {
            $ionicLoading.hide();
            console.log(res);
            return res.data;
          }, function (error) {
            $ionicLoading.hide();
            console.log(error);
            return error.data;
          });
      },

      buyTicketPaypalService: function (informationsBillets, somme, idBillet) {
        $ionicLoading.show({
          template: 'Chargement...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        return $http({
          method: "POST",
          url: config.URL + "/api/achats/" + localStorage.getItem('authorizationToken') + "/tickets/" + idBillet,
          data: {
            numero: informationsBillets.numero, typeBillet: informationsBillets.typeBillet,
            nbreTicket: informationsBillets.nbreTicket, transID: null, montant: somme,
            operateur: "paypal"
          }
        })
          .then(function (res) {
            console.log(res);
            $ionicLoading.hide();
            return res.data;
          }, function (error) {
            console.log(error);
            $ionicLoading.hide();
            return error.data;
          });
      },

      buyTicketFloozService: function (informationsBillets, somme, idBillet) {
        $ionicLoading.show({
          template: 'Achat en cours...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        return $http({
          method: "POST",
          url: config.URL + "/api/achats/" + localStorage.getItem('authorizationToken') + "/tickets/" + idBillet,
          data: {
            numero: informationsBillets.numero, typeBillet: informationsBillets.typeBillet,
            nbreTicket: informationsBillets.nbreTicket, transID: null, montant: somme,
            operateur: "flooz"
          }
        })
        .then(function (res) {
          console.log(res);
          $ionicLoading.hide();
          return res.data;
        }, function (error) {
          console.log(error);
          $ionicLoading.hide();
          return error.data;
        });
      },

      buyTicketMTNService: function (informationsBillets, somme, idBillet) {
        $ionicLoading.show({
          template: 'Achat en cours...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        return $http({
          method: "POST",
          url: config.URL + "/api/achats/" + localStorage.getItem('authorizationToken') + "/tickets/" + idBillet,
          data: {
            numero: informationsBillets.numero, typeBillet: informationsBillets.typeBillet,
            nbreTicket: informationsBillets.nbreTicket, transID: null, montant: somme,
            operateur: "MTN"
          }
        })
        .then(function (res) {
          console.log(res);
          $ionicLoading.hide();
          return res.data;
        }, function (error) {
          console.log(error);
          $ionicLoading.hide();
          return error.data;
        });
      },

      reserverTicketService: function (idBillet) {
        $ionicLoading.show({
          template: 'Réservation en cours...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        return $http.post(config.URL + "/api/reservations/" + localStorage.getItem('authorizationToken') + "/tickets/" + idBillet)
          .then(function (res) {
            $ionicLoading.hide();
            return res.data;
          }, function (error) {
            $ionicLoading.hide();
            console.log(error);
            return error.data;
          })
      },

      getTokenPaypal: function(){
        $ionicLoading.show({
          template: 'Transaction en cours...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        return $http({
          method: "POST",
          //url: "https://api.sandbox.paypal.com/v1/oauth2/token",
          url: "https://api.paypal.com/v1/oauth2/token",
          async: true,
          crossDomain: true,
          headers: {
            'content-type': "application/x-www-form-urlencoded",
            'authorization': "Basic QWJBX0VDS01YZmVuTVcza1JyTHNWYldOVkpXVVpsdFVTcUd3aWdKa3BPdVdfMmt"+
            "TYUp5SEw2NlFzN2F6LTZzT1lZa2pXT3ZzcVJHZlB6c086RUE3QW5qMU5wazYzcm5fU1VVRXp0aW9OdVFRcHZzcE"+
            "RVc0cwTUY5Q0lSbHhRRlZSTFMxMmZjVG91aHFRZjJCb2x5aGxpbFB1d3RHTVFtaFE=",
            'cache-control': "no-cache",
            'postman-token': "d46c01f9-470c-7c95-5436-6512182160f9"
          },
          data: 'grant_type=client_credentials'
        })
          .then(function( res ) {
            console.log( JSON.stringify(res));
            $ionicLoading.hide();
            return res.data;
          }, function( error ) {
            console.log( JSON.stringify(error));
            Alert('Erreur lors de la transaction');
            $ionicLoading.hide();
            return error.data;
          })
      },

      paypalPayment:function(somme, token, idTransaction) {
        return $http({
          method: "POST",
          //url: "https://api.sandbox.paypal.com/v1/payments/payment",
          url: "https://api.paypal.com/v1/payments/payment",
          headers: {
            'content-type': "application/json",
            'authorization': "Bearer "+ token
          },
          data: {
            "intent":"sale",
            "redirect_urls":{
              //"return_url":"http://www.sen-pass.com",
              "return_url": "https://www.sen-pass.com/web/app_dev.php/resultat-paiement/" + idTransaction,
              "cancel_url": "https://www.sen-pass.com/web/app_dev.php/resultat-paiement/" + idTransaction
              //"cancel_url":"http://www.sen-pass.com"
            },
            "payer":{
              "payment_method":"paypal"
            },
            "transactions":[
              {
                "amount":{
                  "total":somme,
                  "currency":"EUR"
                }
              }
            ]
          }
        })
          .then(function( res ) {
            return res.data;
          }, function( error ) {
            return error.data;
          })
      },

      executePayment: function(token, url, payer_id) {
        return $http({
          method: "POST",
          url: url,
          headers: {
            'content-type': "application/json",
            'authorization': "Bearer "+ token
          },
          data: {
            "payer_id": payer_id
          }
        })
          .then(function( res ) {
            return res.data;
          }, function( error ) {
            return error.data;
          })
      },

      updateTransacId: function(idRequest, idTransaction){
        return $http.get(config.URL + "/api/waris/" + localStorage.getItem('authorizationToken') + "/ids/" + idRequest + "/references/" + idTransaction)
            .then(function (res) {
                console.log(res);
                return res.data;
            }, function (error) {
                console.log(error);
                return error.data;
            })
      }
    }

  });

