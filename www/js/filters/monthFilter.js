/**
 * Created by lakhassane on 26/10/2016.
 */

angular.module('app')

  // This filter transform a text with any tag in a a plain text with no tag.
  // It will probably mostly be used for links.
  .filter('convertDate', function () {
    return function (text) {
      if ( text == 'January' ) {
        return 'Janvier';
      }
      if ( text == 'February' ) {
        return 'Février';
      }
      if ( text == 'March' ) {
        return 'Mars';
      }
      if ( text == 'April' ) {
        return 'Avril';
      }
      if ( text == 'May' ) {
        return 'Mai';
      }
      if ( text == 'June' ) {
        return 'Juin';
      }
      if ( text == 'July' ) {
        return 'Juillet';
      }
      if ( text == 'August' ) {
        return 'Août';
      }
      if ( text == 'September' ) {
        return 'Septembre';
      }
      if ( text == 'October' ) {
        return 'Octobre';
      }
      if ( text == 'November' ) {
        return 'Novembre';
      }
      if ( text == 'December' ) {
        return 'Décembre';
      }
    };
  });
