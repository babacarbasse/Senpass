/**
 * Created by lakhassane on 21/03/2016.
 */

angular.module('app')

  .controller('HomeController', function ($scope, $rootScope, $timeout, $stateParams, $ionicModal, $window,
                                          Store, HomeService, AccountService, config) {

    $scope.billet = '';
    $scope.image = '';

    $scope.ticket = {
      nbreTicket: ''
    };

    $scope.achat = {
      numero: [null],
      typeBillet: [null],
      nbreTicket: [null]
    };
    $scope._PAYS = Store.getUserLocation();

    HomeService.getInfoOperateurService()
      .then(function( result ) {
        /*$scope.infosBancaireOM.S2M_COMMANDE = result.commande;
        $scope.infosBancaireOM.S2M_DATEH = result.dateh;
        $scope.infosBancaireOM.S2M_HTYPE =  'SHA512';
        $scope.infosBancaireOM.S2M_IDENTIFIANT = result.identifiant;
        $scope.infosBancaireOM.S2M_REF_COMMANDE = "lakhassane";
        $scope.infosBancaireOM.S2M_SITE = result.site;
        $scope.infosBancaireOM.S2M_HMAC = result.hmac;*/
        $scope.infosBancaireOM.S2M_COMMANDE = "Paiement par orange money";
        $scope.infosBancaireOM.S2M_DATEH = "2016-10-10T15:49:26+02:00";
        $scope.infosBancaireOM.S2M_HMAC = "F71C327093B273261FD80A94C6AEAAC863B56C3A0C6656A0C64AC0FB4C6B3BCE262E8CFCBB6A1E027018CDD621FB2EF8DB161A6119CF4A021A30F4E5FD556F48";
        $scope.infosBancaireOM.S2M_HTYPE =  'SHA512';
        $scope.infosBancaireOM.S2M_IDENTIFIANT = "2daf3bd4e27a898a85230ce4b9bf4644";
        $scope.infosBancaireOM.S2M_REF_COMMANDE = "lakhassane";
        $scope.infosBancaireOM.S2M_SITE = "2ba76cb9a9e4dbee1315a6e8072b6589";
        $scope.infosBancaireOM.S2M_TOTAL = 10;
      });

    $scope.infosBancaire = {
      cardnumber: '',
      typecard: '',
      cvv: '',
      expiredate: '',
      mois: '',
      annee: '',
      email: '',
      lastname: '',
      firstname: ''
    };

    $scope.infosBancaireOM = {
      S2M_COMMANDE: '',
      S2M_DATEH: '',
      S2M_HTYPE: '',
      S2M_IDENTIFIANT: '',
      S2M_REF_COMMANDE: '',
      S2M_SITE: '',
      S2M_TOTAL: '',
      S2M_HMAC: ''
    };

    $scope.OTP = {
      otp: '',
      transid: ''
    };

    $scope.getTypeBillet = function (id_billet) {
      HomeService.getTypesBilletService(id_billet)
        .then(function (res) {
          $scope.TypeBillet = [];

          for (var i = 0; i < res.types.length; i++) {
            if ( res.restants[ res.types[i].id ] > 0 ) {
              $scope.TypeBillet.push({
                id: res.types[i].id,
                nom: res.types[i].nom,
                prix: res.types[i].prix,
                prix_om: Number(res.types[i].prix) + ( Number(res.types[i].prix) * Number(res.types[i].billet.commission_om) / 100 ),
                prix_wari: Number(res.types[i].prix) + ( Number(res.types[i].prix) * Number(res.types[i].billet.commission_wari) / 100 ),
                prix_paypal: Number(res.types[i].prix) + ( Number(res.types[i].prix) * Number(res.types[i].billet.commission_paypal) / 100 ),
                nombre: res.types[i].nombre,
                restant: res.restants[res.types[i].id]
              });
            }
          }

          if ( $scope.TypeBillet.length == 0 ) {
            $scope.nombreType = 0;
            $scope.messageTypeBillets = "Ce ticket est épuisé.";
          } else {
            $scope.nombreType = 1;
          }
          console.log(JSON.stringify(res));
        }, function (error) {
          console.log(error);
        })
    };

    for (var i = 0; i < Store.getBillet().length + Store.getBilletRestaurant().length
                      + Store.getBilletResultSearch().length; i++) {
      if ( !angular.isUndefined(Store.getBillet()[i] ) && Store.getBillet()[i].id == $stateParams.id ) {
        $scope.billet = Store.getBillet()[i];
        $scope.image = $scope.billet.image;

        $scope.getTypeBillet($scope.billet.id);
        break;
      } else {
        if ( !angular.isUndefined(Store.getBilletRestaurant()[i]) && Store.getBilletRestaurant()[i].id == $stateParams.id ) {
          $scope.billet = Store.getBilletRestaurant()[i];
          $scope.image = $scope.billet.image;
  
          $scope.getTypeBillet($scope.billet.id);
          break;
        } else {
          if ( !angular.isUndefined(Store.getBilletResultSearch()[i]) && Store.getBilletResultSearch()[i].id == $stateParams.id ) {
            $scope.billet = Store.getBilletResultSearch()[i];
            $scope.image = $scope.billet.image;
    
            $scope.getTypeBillet($scope.billet.id);
            break;
          }
        }
      }
    }

    $scope.nbreTicketChange = function () {
      $scope.items = [];
      for (var i = 0; i < $scope.ticket.nbreTicket; i++) {
        $scope.items.push({
          ticket: i + 1
        });
      }
    };

    $scope._prixHorsTax = 0;
    $scope._montantTva = 0;
    $scope._montantCommission = 0;
    $scope.calculSommeTotalAchat = function(informationsBillets) {
      var somme = 0;
      $scope._prixHorsTax = 0;  
      $scope._montantCommission = 0;
      $scope._montantTva = 0;
      var x;
      var y;
      for (y = 0; y < informationsBillets.numero.length; y++) {
        angular.forEach(informationsBillets.typeBillet[y], function (value, x) {
          if (value == true && informationsBillets.nbreTicket[y][x] !== null && 
            informationsBillets.nbreTicket[y][x] != 0) {
              somme+=$scope.TypeBillet[x].prix*informationsBillets.nbreTicket[y][x]
          }
        });
      }

      $scope._prixHorsTax = somme;
       
      switch($scope.infosBancaire.typecard) {
        case 'OM' :
          $scope._montantCommission = (somme * Number($scope.billet.commission_om)/100);
          somme += (somme * Number($scope.billet.commission_om)/100);
          break;
        case 'MTN' : 
          $scope._montantCommission = (somme * Number($scope.billet.commission_om)/100);
          somme += (somme * Number($scope.billet.commission_om)/100);
          break;
        case 'Flooz' : 
          $scope._montantCommission = (somme * Number($scope.billet.commission_wari)/100);
          somme += (somme * Number($scope.billet.commission_wari)/100);
          break;
        case 'Wari' : 
          $scope._montantCommission = (somme * Number($scope.billet.commission_wari)/100);
          somme += (somme * Number($scope.billet.commission_wari)/100);
          break;
        case 'Paypal' : 
          $scope._montantCommission = (somme * Number($scope.billet.commission_paypal)/100);
          somme += ((somme * Number($scope.billet.commission_paypal))/100 +
                    Number($scope.billet.surchage_paypal));
          break;
        default:
          break;
      }

      $scope._montantTva = Math.round(somme * Number($scope.billet.tva/100));
      $scope._montantCommission = Math.round($scope._montantCommission);
      somme += somme * Number($scope.billet.tva/100);
      return Math.round(somme);
    }

    /****Debut achat avec MTN****/
    $scope.buyTicketMTN = function (informationsBillets, idBillet) {
      var informationsBilletSubmit = {
        numero: [],
        typeBillet: [],
        nbreTicket: []
      };

      var y = 0;
      var x = 0;
      while ( y < $scope.items.length ) {
        var z = 0;
        if( informationsBillets.numero[y] == null || informationsBillets.numero[y] == undefined ) {
          $rootScope.showAlert("Veuillez saisir un numéro de téléphone.", "red");
        }  else if (informationsBillets.typeBillet[y] == null || informationsBillets.typeBillet[y] == undefined ) {
          $rootScope.showAlert("Veuillez choisir un type de ticket.", "red");
        } else if ( informationsBillets.nbreTicket[y] == null || informationsBillets.nbreTicket[y] == undefined ) {
          $rootScope.showAlert("Veuillez choisir la quantité de ticket.", "red");
        }
        while ( z < $scope.TypeBillet.length ) {
       // for ( var z = 0; z < $scope.TypeBillet.length; z++ ) {
          if ( informationsBillets.typeBillet[y][z] == true ) {
            informationsBilletSubmit.numero[ x ] = informationsBillets.numero[y];
            informationsBilletSubmit.typeBillet[ x ] = $scope.TypeBillet[z].id;
            informationsBilletSubmit.nbreTicket[ x ] = informationsBillets.nbreTicket[y][z];
            x++;
          }
          z++;
        }
        y++;
      }
      var somme = $scope.calculSommeTotalAchat(informationsBillets);

      HomeService.buyTicketMTNService(informationsBilletSubmit, somme, idBillet)
      .then(function ( res ) {
        if ( res.resultat == 1) {
          if (res.message.success === 1) {
            $rootScope.showAlert("VEUILLEZ CONFIRMER VOTRE ACHAT AVEC LE MESSAGE DE CONFIRMATION RECU.", "blue");
          } else {
            $rootScope.showAlert("ECHEC DE LA TRANSACTION.", "red");
          }
          // $timeout(function() {
          //   window.open(config.URL + "/paiement.php?montant=" + res.somme + "&transaction=" + res.idTransaction, "_blank", "location=yes");
          // }, 4000);
          $scope.closeModalBuy();
        } else if ( res.echec == 3 ) {
          $rootScope.showAlert("Le numéro saisi n'est pas celui d'un étudiant.", "red");
        } else if ( res.echec == 4 ) {
          $rootScope.showAlert("Vous ne pouvez pas acheter de tickets pour cet étudiant.", "red");
        } else if ( res.echec == 5 ) {
          $rootScope.showAlert("Le numéro saisi n'est pas celui d'un utilisateur SenPass.", "red");
        } else if ( res.echec == 6 ) {
          $rootScope.showAlert("Ce numéro n'est pas celui d'un client.", "red");
        } else {
            $rootScope.showAlert("Erreur avec les informations saisies. Veuillez vérifier s'il vous plait.", "red");
        }
      }, function (error) {
        console.log(error);
      })
    }
    /****Fin achat avec MTN****/


    /****Debut achat avec FLOOZ****/
    $scope.buyTicketFlooz = function (informationsBillets, idBillet) {
      var informationsBilletSubmit = {
        numero: [],
        typeBillet: [],
        nbreTicket: []
      };

      var y = 0;
      var x = 0;
      while ( y < $scope.items.length ) {
        var z = 0;
        if( informationsBillets.numero[y] == null || informationsBillets.numero[y] == undefined ) {
          $rootScope.showAlert("Veuillez saisir un numéro de téléphone.", "red");
        }  else if (informationsBillets.typeBillet[y] == null || informationsBillets.typeBillet[y] == undefined ) {
          $rootScope.showAlert("Veuillez choisir un type de ticket.", "red");
        } else if ( informationsBillets.nbreTicket[y] == null || informationsBillets.nbreTicket[y] == undefined ) {
          $rootScope.showAlert("Veuillez choisir la quantité de ticket.", "red");
        }
        while ( z < $scope.TypeBillet.length ) {
       // for ( var z = 0; z < $scope.TypeBillet.length; z++ ) {
          if ( informationsBillets.typeBillet[y][z] == true ) {
            informationsBilletSubmit.numero[ x ] = informationsBillets.numero[y];
            informationsBilletSubmit.typeBillet[ x ] = $scope.TypeBillet[z].id;
            informationsBilletSubmit.nbreTicket[ x ] = informationsBillets.nbreTicket[y][z];
            x++;
          }
          z++;
        }
        y++;
      }
      var somme = 0;
      var somme = $scope.calculSommeTotalAchat(informationsBillets);
      // for ( var i = 0; i < informationsBillets.typeBillet.length; i++ ) { // On calcule le montant total à payer en
      //   // multipliant le nombre de ticket achetés avec le tarif du type du ticket
      //   somme += ( Number(informationsBillets.typeBillet[i].prix) * Number(informationsBillets.nbreTicket[i]) ) +
      //     (Number(informationsBillets.typeBillet[i].prix) * Number(informationsBillets.nbreTicket[i] * $scope.billet.taux_the_commission)) / 100;
      // }

      HomeService.buyTicketFloozService(informationsBilletSubmit, somme, idBillet)
      .then(function ( res ) {
        if ( res.resultat == 1) {
          if (res.message.success === 1) {
            $rootScope.showAlert("VEUILLEZ CONFIRMER VOTRE ACHAT AVEC LE MESSAGE DE CONFIRMATION RECU.", "blue");
          } else {
            $rootScope.showAlert("ECHEC DE LA TRANSACTION.", "red");
          }
          // $timeout(function() {
          //   window.open(config.URL + "/paiement.php?montant=" + res.somme + "&transaction=" + res.idTransaction, "_blank", "location=yes");
          // }, 4000);
          $scope.closeModalBuy();
        } else if ( res.echec == 3 ) {
          $rootScope.showAlert("Le numéro saisi n'est pas celui d'un étudiant.", "red");
        } else if ( res.echec == 4 ) {
          $rootScope.showAlert("Vous ne pouvez pas acheter de tickets pour cet étudiant.", "red");
        } else if ( res.echec == 5 ) {
          $rootScope.showAlert("Le numéro saisi n'est pas celui d'un utilisateur SenPass.", "red");
        } else if ( res.echec == 6 ) {
          $rootScope.showAlert("Ce numéro n'est pas celui d'un client.", "red");
        } else {
            $rootScope.showAlert("Erreur avec les informations saisies. Veuillez vérifier s'il vous plait.", "red");
        }
      }, function (error) {
        console.log(error);
      })
    }

    /****Fin achat avec FLOOZ****/

    /* PAYPAL PAYMENT CONFIGURATION -- BEGINNING */
    $scope.initPaymentUI =  function() {
      var clientIDs = {
        "PayPalEnvironmentProduction": "",
        "PayPalEnvironmentSandbox": "AbF7omRrTaWOTtRJGPtZCksOPVYRivScJnAcEhJf9sFW4D4hfRad6K0JKYaC2d31DNu5DasZSQKjsjsY"
      };
      PayPalMobile.init(clientIDs, $scope.onPayPalMobileInit);
    };
    $scope.onSuccesfulPayment =  function(payment) {
      console.log("payment success: " + JSON.stringify(payment, null, 4));
    };
    $scope.onUserCanceled = function(result) {
      console.log(result);
    };
    $scope.onAuthorizationCallback =  function(authorization) {
      console.log("authorization: " + JSON.stringify(authorization, null, 4));
    };
    $scope.onPrepareRender = function(){
      console.log(" ======= onPrepareRender ==========");
    };
    $scope.createPayment = function() {
      // for simplicity use predefined amount
      var paymentDetails = new PayPalPaymentDetails("5.00", "0.00", "0.00");
      var payment = new PayPalPayment("5.00", "USD", "Awesome Sauce", "Sale", paymentDetails);
      return payment;
    };
    $scope.configuration = function() {
      // for more options see `paypal-mobile-js-helper.js`
      var configurations = new PayPalConfiguration({
        merchantName: "SenPass",
        merchantPrivacyPolicyURL: "https://mytestshop.com/policy",
        merchantUserAgreementURL: "https://mytestshop.com/agreement"
      });
      return configurations;
    };
    $scope.onPayPalMobileInit = function() {
      // must be called
      // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
      PayPalMobile.prepareToRender("PayPalEnvironmentNoNetwork", $scope.configuration(), $scope.onPrepareRender);
    };
    $scope.GET = function( param, url ) {
      var vars = {};
      url.replace( location.hash, '' ).replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function( m, key, value ) { // callback
          vars[key] = value !== undefined ? value : '';
        }
      );
      if ( param ) {
        return vars[param] ? vars[param] : null;
      }
      return vars;
    };
    /* PAYPAL PAYMENT CONFIGURATION -- ENDING */

    $scope.buyTicketPaypal = function(informationsBillets, infosBancaireOM, idBillet) {
      $scope.url = '';
      $scope.access_token = '';

      HomeService.getTokenPaypal()
        .then( function( res ) {
          $scope.access_token = res.access_token;
          HomeService.paypalPayment(10, res.access_token)
            .then(function( res2 ) {
              console.log( res2 );
              var paypalWindow = window.open(res2.links[1].href, "_blank", "location=yes");
              paypalWindow.addEventListener('loadstop', function(event) {
                $scope.url = event.url
              });
              paypalWindow.addEventListener('exit', function(event) {
                alert($scope.url);
                alert($scope.GET("PayerID", $scope.url));
                HomeService.executePayment($scope.access_token, res2.links[2].href, $scope.GET("PayerID", $scope.url))
                  .then(function( res3 ) {
                    alert(JSON.stringify(res3));
                  })
              });
            }, function ( error ){
              alert(error);
            })
        });
      //PayPalMobile.renderSinglePaymentUI($scope.createPayment(), $scope.onSuccesfulPayment, $scope.onUserCanceled);
    };

    $scope.buyTicketOM = function (informationsBillets, infosBancaireOM, idBillet) {
      var informationsBilletSubmit = {
        numero: [],
        typeBillet: [],
        nbreTicket: []
      };

      var y = 0;
      var x = 0;

      //while ( y < informationsBillets.numero.length ) {
      while ( y < $scope.items.length ) {
        var z = 0;
        if( informationsBillets.numero[y] == null || informationsBillets.numero[y] == undefined ) {
          $rootScope.showAlert("Veuillez saisir un numéro de téléphone.", "red");
        }  else if (informationsBillets.typeBillet[y] == null || informationsBillets.typeBillet[y] == undefined ) {
          $rootScope.showAlert("Veuillez choisir un type de ticket.", "red");
        } else if ( informationsBillets.nbreTicket[y] == null || informationsBillets.nbreTicket[y] == undefined ) {
          $rootScope.showAlert("Veuillez choisir la quantité de ticket.", "red");
        }
        while ( z < $scope.TypeBillet.length ) {
          if ( informationsBillets.typeBillet[y][z]  == true ) {
            informationsBilletSubmit.numero[ x ] = informationsBillets.numero[y];
            informationsBilletSubmit.typeBillet[ x ] = $scope.TypeBillet[z].id;
            informationsBilletSubmit.nbreTicket[ x ] = informationsBillets.nbreTicket[y][z];
            x++;
          }
          z++;
        }
        y++;
      }
      var somme = 0;
      /*for ( var i = 0; i < informationsBillets.typeBillet.length; i++ ) { // On calcule le montant total à payer en
        // multipliant le nombre de ticket achetés avec le tarif du type du ticket
        somme += ( Number(informationsBillets.typeBillet[i].prix) * Number(informationsBillets.nbreTicket[i]) ) +
          (Number(informationsBillets.typeBillet[i].prix) * Number(informationsBillets.nbreTicket[i] * $scope.billet.taux_the_commission)) / 100;
      }*/

      //somme += Math.round(somme * $scope.billet.tva);
      //somme = Math.round(somme);
     // $scope.infosBancaireOM.S2M_TOTAL = somme;

      $scope.message = "S2M_COMMANDE=" + $scope.infosBancaireOM.S2M_COMMANDE + "&S2M_DATEH=" + $scope.infosBancaireOM.S2M_DATEH +
          "&S2M_HTYPE=" + $scope.infosBancaireOM.S2M_HTYPE + "&S2M_IDENTIFIANT=" + $scope.infosBancaireOM.S2M_IDENTIFIANT +
          "&S2M_REF_COMMANDE=" + $scope.infosBancaireOM.S2M_REF_COMMANDE + "&S2M_SITE=" + $scope.infosBancaireOM.S2M_SITE +
          "&S2M_TOTAL=" + $scope.infosBancaireOM.S2M_TOTAL;

      /*for ( var j = 0; j < informationsBilletSubmit.numero.length; j++ ) {
        if ( informationsBilletSubmit.numero[j].substring(0, 3) != "221" ) {
          informationsBilletSubmit.numero[j] = "221"+informationsBilletSubmit.numero[j];
        }
      } */

      HomeService.buyTicketOMService(informationsBilletSubmit, infosBancaireOM, somme, idBillet)
        .then(function ( res ) {
          if ( res.resultat == 1) {
            $rootScope.showAlert("VEUILLEZ ATTENDRE LE MESSAGE PAIEMENT AVEC SUCCES AVANT DE FERMER LA FENETRE SUIVANTE.", "blue");
            $timeout(function() {
              window.open("https://www.sen-pass.com/web/paiement.php?montant=" + res.somme + "&transaction=" + res.idTransaction, "_blank", "location=yes");
            }, 4000);
            $scope.closeModalBuy();
          } else if ( res.echec == 3 ) {
            $rootScope.showAlert("Le numéro saisi n'est pas celui d'un étudiant.", "red");
          } else if ( res.echec == 4 ) {
            $rootScope.showAlert("Vous ne pouvez pas acheter de tickets pour cet étudiant.", "red");
          } else if ( res.echec == 5 ) {
            $rootScope.showAlert("Le numéro saisi n'est pas celui d'un utilisateur SenPass.", "red");
          } else if ( res.echec == 6 ) {
            $rootScope.showAlert("Ce numéro n'est pas celui d'un client.", "red");
          } else {
              $rootScope.showAlert("Erreur avec les informations saisies. Veuillez vérifier s'il vous plait.", "red");
          }
        }, function (error) {
          console.log(error);
        })
    };

    $scope.buyTicketCB = function (informationsBillets, infosBancaire, idBillet) {
      //alert(JSON.stringify(infosBancaire));
      var informationsBilletSubmit = {
        numero: [],
        typeBillet: [],
        nbreTicket: []
      };

      var y = 0;
      var x = 0;
      while ( y < $scope.items.length ) {
        var z = 0;
        if( informationsBillets.numero[y] == null || informationsBillets.numero[y] == undefined ) {
          $rootScope.showAlert("Veuillez saisir un numéro de téléphone.", "red");
        }  else if (informationsBillets.typeBillet[y] == null || informationsBillets.typeBillet[y] == undefined ) {
          $rootScope.showAlert("Veuillez choisir un type de ticket.", "red");
        } else if ( informationsBillets.nbreTicket[y] == null || informationsBillets.nbreTicket[y] == undefined ) {
          $rootScope.showAlert("Veuillez choisir la quantité de ticket.", "red");
        }
        while ( z < $scope.TypeBillet.length ) {
       // for ( var z = 0; z < $scope.TypeBillet.length; z++ ) {
          if ( informationsBillets.typeBillet[y][z] == true ) {
            informationsBilletSubmit.numero[ x ] = informationsBillets.numero[y];
            informationsBilletSubmit.typeBillet[ x ] = $scope.TypeBillet[z].id;
            informationsBilletSubmit.nbreTicket[ x ] = informationsBillets.nbreTicket[y][z];
            x++;
          }
          z++;
        }
        y++;
      }

      var somme = 0;

      /*for ( var j = 0; j < informationsBilletSubmit.numero.length; j++ ) {
        if ( informationsBilletSubmit.numero[j].substring(0, 3) != "221" ) {
          informationsBilletSubmit.numero[j] = "221"+informationsBilletSubmit.numero[j];
        }
      } */
   //   alert(JSON.stringify(informationsBilletSubmit));

      HomeService.buyTicketCBService(informationsBilletSubmit, Math.round(somme), idBillet)
        .then(function ( res ) {
          if ( res.resultat == 1 ) {
            localStorage.setItem("idTransaction", res.idTransaction);
            HomeService.buyTicketService(informationsBilletSubmit, infosBancaire, res.somme, res.idTransaction, idBillet)
              .then(function ( res ) {
                console.log("code : "  + res.code);
                if ( res.code == "000" && res.code3d == "5555" ) {
                  window.open(res.url, "_blank", "location=yes");
                  $scope.closeModalBuy();
                } else {
                  $rootScope.showAlert("Erreur avec la carte Visa.", "red");
                }
                if (res.resultat) {
                  alert('Votre achat a bien été effectué.');
                } else if (res.echec) {
                  $rootScope.showAlert("Il y a eu erreur pendant l\'achat. Veuillez reprendre ultérieurement.", "red");
                  AccountService.supprimerAchatService( localStorage.getItem("idTransaction") )
                    .then(function( res ) {
                      console.log(res);
                    }, function(error) {
                      //alert("echec");
                    });
                }
              }, function (error) {
                alert(error);
                console.log(error);
              })
          } else if ( res.echec == 3 ) {
            $rootScope.showAlert("Le numéro saisi n'est pas celui d'un étudiant.", "red");
          } else if ( res.echec == 4 ) {
            $rootScope.showAlert("Vous ne pouvez pas acheter de tickets pour cet étudiant.", "red");
          } else if ( res.echec == 5 ) {
            $rootScope.showAlert("Le numéro saisi n'est pas celui d'un utilisateur SenPass.", "red");
          } else if ( res.echec == 6 ) {
            $rootScope.showAlert("Ce numéro n'est pas celui d'un client.", "red");
          } else {
            $rootScope.showAlert("Erreur avec les informations saisies. Veuillez vérifier s'il vous plait.", "red");
          }
        }, function (error) {
          alert(error);
          console.log(error);
        })
    };

    $scope.buyTicketWARI = function (informationsBillets, infosBancaire, idBillet) {
      var informationsBilletSubmit = {
        numero: [],
        typeBillet: [],
        nbreTicket: []
      };

      var y = 0;
      var x = 0;
      while ( y < $scope.items.length ) {
        var z = 0;
        if( informationsBillets.numero[y] == null || informationsBillets.numero[y] == undefined ) {
          $rootScope.showAlert("Veuillez saisir un numéro de téléphone.", "red");
        }  else if (informationsBillets.typeBillet[y] == null || informationsBillets.typeBillet[y] == undefined ) {
          $rootScope.showAlert("Veuillez choisir un type de ticket.", "red");
        } else if ( informationsBillets.nbreTicket[y] == null || informationsBillets.nbreTicket[y] == undefined ) {
          $rootScope.showAlert("Veuillez choisir la quantité de ticket.", "red");
        }
        while ( z < $scope.TypeBillet.length ) {
          // for ( var z = 0; z < $scope.TypeBillet.length; z++ ) {
          if ( informationsBillets.typeBillet[y][z] == true ) {
            informationsBilletSubmit.numero[ x ] = informationsBillets.numero[y];
            informationsBilletSubmit.typeBillet[ x ] = $scope.TypeBillet[z].id;
            informationsBilletSubmit.nbreTicket[ x ] = informationsBillets.nbreTicket[y][z];
            x++;
          }
          z++;
        }
        y++;
      }
      var somme = 0;
      
      /*for ( var i = 0; i < informationsBillets.typeBillet.length; i++ ) { // On calcule le montant total à payer en
        // multipliant le nombre de ticket achetés avec le tarif du type du ticket puis en ajoutant la valeur obtenu
        // après multiplication de chaque billet avec le taux de commission
        somme += ( Number(informationsBillets.typeBillet[i].prix) * Number(informationsBillets.nbreTicket[i]) ) +
          (Number(informationsBillets.typeBillet[i].prix) * Number(informationsBillets.nbreTicket[i] * Number($scope.billet.taux_the_commission))) / 100;
      }
      // On applique le tva
      somme = Math.round(somme + somme * Number($scope.billet.tva));
       */
      /*for ( var j = 0; j < informationsBilletSubmit.numero.length; j++ ) {
        if ( informationsBilletSubmit.numero[j].substring(0, 3) != "221" ) {
          informationsBilletSubmit.numero[j] = "221"+informationsBilletSubmit.numero[j];
        }
      }*/
      HomeService.buyTicketWariService(informationsBilletSubmit, Math.round(somme), idBillet)
        .then(function ( res ) {
          if ( res.resultat == 1 ) {
            localStorage.setItem("idTransaction", res.idTransaction);
            HomeService.buyTicketService(informationsBilletSubmit, infosBancaire, res.somme, res.idTransaction, idBillet)
              .then(function ( res ) {
                console.log("code : "  + res.code);
                if( res.code == "000" ) { // Si le code reçu est correct
                  $scope.OTP.transid = res.transid; // On pré-remplit l'identification de la transaction
                  $scope.openModalOTP(); // On ouvre celui pour le code OTP reçu par sms
                } else {
                  AccountService.supprimerAchatService( localStorage.getItem("idTransaction") )
                    .then(function( res ) {
                      console.log(res);
                    }, function(error) {
                     // alert("echec");
                    });
                  $rootScope.showAlert("Informations de paiement inexactes.", "red");
                }
                if (res.resultat) {
                  window.location.href = res.url;
                  alert('Votre achat a bien été effectué.');
                }
              }, function (error) {
                alert(error);
                console.log(error);
              })
          } else if ( res.echec == 3 ) {
            $rootScope.showAlert("Le numéro saisi n'est pas celui d'un étudiant.", "red");
          } else if ( res.echec == 4 ) {
            $rootScope.showAlert("Vous ne pouvez pas acheter de tickets pour cet étudiant.", "red");
          } else if ( res.echec == 5 ) {
            $rootScope.showAlert("Le numéro saisi n'est pas celui d'un utilisateur SenPass.", "red");
          } else if ( res.echec == 6 ) {
            $rootScope.showAlert("Ce numéro n'est pas celui d'un client.", "red");
          } else {
            $rootScope.showAlert("Erreur avec les informations saisies. Veuillez vérifier s'il vous plait.", "red");
          }
        }, function (error) {
          alert(error);
          console.log(error);
        })
    };

    $scope.registerOTPAndPurchase = function(informationsBillets, OTP, idBillet) {
      HomeService.registerOTPAndPurchaseService(informationsBillets, OTP, idBillet)
        .then( function ( res ) {
          $scope.OTP.transid = '';
          localStorage.setItem("transID", res.transid);
          if ( res.code == "000" ) {
            alert('Votre achat a bien été effectué.');
              HomeService.updateTransacId(localStorage.getItem("idTransaction"), res.transid)
              .then(function(resultUpdate){
                  // echec= 2 : transaction introuvable
                  // echec = 3 : transaction déjà enregistré
                  console.log('update');
                  console.log(resultUpdate);
                }, function(errorUpdate) {
                    console.log('error update');
                })
          } else if ( res.code == "111" ) {
            $rootScope.showAlert("Code OTP incorrect.", "red");
            AccountService.supprimerAchatService( localStorage.getItem("idTransaction") )
              .then(function( res ) {
                console.log(res);
              }, function(error) {
                //alert("echec");
              });
          } else {
            AccountService.supprimerAchatService( localStorage.getItem("idTransaction") )
              .then(function( res ) {
                console.log(res);
              }, function(error) {
                //alert("echec");
              });
            $rootScope.showAlert("Il y a eu erreur pendant l\'achat. Veuillez reprendre ultérieurement.", "red");
          }
          $scope.closeModalBuy();
          $scope.closeModalOTP();
        })
    };

    $scope.reserverTicket = function (informationsBillets, idBillet) {
      HomeService.reserverTicketService(informationsBillets, idBillet)
        .then(function (res) {
          if (res.resultat) {
            alert('Votre réservation a bien été effectué.');
          } else if (res.echec) {
            alert('Il y a eu erreur pendant la réservation. Veuillez reprendre ultérieurement.');
          }
          $scope.closeModalBuy();
        }, function (error) {
          console.log(error);
        })
    };

    // Template d'achat de tickets
    $ionicModal.fromTemplateUrl('buy_tickets.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModalBuy = function () {
      $scope.modal.show();
    };
    $scope.closeModalBuy = function () {
      $scope.ticket.nbreTicket = '';
      $scope.achat.numero = [];
      $scope.achat.typeBillet = [];
      $scope.achat.nbreTicket = [];
      $scope.items = [];

      $scope.infosBancaire.cardnumber = '';
      $scope.infosBancaire.cvv = '';

      $scope.modal.hide();
    };

    // Template pour enregistrement code OTP
    $ionicModal.fromTemplateUrl('code_otp.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal2 = modal;
    });
    $scope.openModalOTP = function () {
      $scope.modal2.show();
    };
    $scope.closeModalOTP = function () {
      $scope.OTP.transid = '';
      $scope.OTP.otp = '';
      $scope.modal2.hide();
    };

    // Template d'achat de tickets
    $ionicModal.fromTemplateUrl('detailAchat.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modalDetailAchat = modal;
    });

    $scope._sommeTotal = 0;
    $scope.openModalDetailAchat = function() {
      var informationsBilletSubmit = {
        numero: [],
        typeBillet: [],
        nbreTicket: []
      };
      
      $scope.modalDetailAchat.show();
    }
    $scope.closeModalDetailAchat = function () {
      $scope.modalDetailAchat.hide();
    };

    if($scope.billet.code === 'sn') {
      $scope.infosBancaire.typecard = 'OM'
    } else {
      $scope.infosBancaire.typecard = 'MTN'
    }
    //$scope.initPaymentUI();

  });
