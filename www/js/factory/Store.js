/**
 * Created by lakhassane on 21/03/2016.
 */

angular.module('app')
  .service('Store', function () {
    var billet = [];
    var billetRestaurant = [];
    var billetResultSearch = [];
    var image = [];
    var discussion = [];
    var achat = [];
    var achatRestauration = [];
    var reservation = [];
    var transfert = [];
    var archive = [];
    var userLocation = '';

    return {

      getUserLocation: function() {
        return userLocation;
      },

      setUserLocation: function (newUserLocation) {
          userLocation = newUserLocation;
      },

      getBilletResultSearch: function() {
        return billetResultSearch;
      },
      
      setBilletResultSearch: function(newBillet) {
        billetResultSearch = newBillet;
      },

      getBillet: function() {
        return billet;
      },
      setBillet: function(newBillet) {
        billet = newBillet;
      },
      getBilletById: function(id) {
        var i = 0;
        while ( billet[i].id != id && i < billet.length ) {
          i++;
        }
        return billet[i];
      },


      getBilletRestaurant: function() {
        return billetRestaurant;
      },
      setBilletRestaurant: function(newBilletRestaurant) {
        billetRestaurant = newBilletRestaurant;
      },
      getBilletRestaurantById: function(id) {
        //alert(id + " : "+ billetRestaurant.length);
        //alert(billetRestaurant[i]);
        var i = 0;
        while ( billetRestaurant[i].id != id && i < billetRestaurant.length ) {
          i++;
        }
        return billetRestaurant[i];
      },


      getAchat: function() {
        return achat;
      },
      setAchat: function(newAchat) {
        achat = newAchat;
      },
      getBilletByIdAchat: function(idAchat) {
        var i = 0;
        while ( achat[i].idAchat != idAchat && i < achat.length ) {
          i++;
        }
        return achat[i];
      },

      getArchive: function() {
        return archive;
      },
      setArchive: function(newArchive) {
        archive = newArchive;
      },
      getBilletByIdArchive: function(idArchive) {
        var i = 0;
        while ( archive[i].idArchive != idArchive && i < archive.length ) {
          i++;
        }
        return archive[i];
      },


      getAchatRestauration: function() {
        return achatRestauration;
      },
      setAchatRestauration: function(newAchatRestauration) {
        achatRestauration = newAchatRestauration;
      },
      getBilletByIdAchatRestauration: function(idAchatRestauration) {
        var i = 0;

        while ( achatRestauration[i].idAchat != idAchatRestauration && i < achatRestauration.length ) {
          i++;
        }
        return achatRestauration[i];
      },


      getReservation: function() {
        return reservation;
      },
      setReservation: function(newReservation) {
        reservation = newReservation;
      },
      getBilletByIdReservation: function(idReservation) {
        var i = 0;
        while ( reservation[i].idReservation != idReservation && i < reservation.length ) {
          i++;
        }
        return reservation[i];
      },


      getTransfert: function() {
        return transfert;
      },
      setTransfert: function(newTransfert) {
        transfert = newTransfert;
      },
      getBilletByIdTransfert: function(idTransfert) {
        var i = 0;
        while ( transfert[i].id_transfert != idTransfert && i < transfert.length ) {
          i++;
        }
        return transfert[i];
      },


      getImage: function() {
        return image;
      },

      setImage: function(newImage) {
        image = newImage;
      },


      getDiscussion: function() {
        return discussion;
      },
      setDiscussion: function(newDiscussion) {
        discussion = newDiscussion;
      },
      getDiscussionById: function(id) {
        var i = 0;
        while ( discussion[i].id != id && i < discussion.length ) {
          i++;
        }
        return discussion[i];
      },


      getTypeBilletById: function(billet, id) {
        var i = 0;
        while ( billet.type_billet[i].id != id && i < billet.type_billet.length ) {
          i++;
        }
        alert (JSON.stringify(billet.type_billet[i]));
        return billet.type_billet[i];

      }

    };
  });
