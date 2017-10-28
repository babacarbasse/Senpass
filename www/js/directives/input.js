/**
 * Created by lakhassane on 06/09/2016.
 */
angular.module('app')
  .directive('inputValue', function ($parse) {
    return {
      //restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs) {
        if (attrs.value) {console.log('test');
          $parse(attrs.ngModel).assign(scope, attrs.value);
        }
      }
    };
  });
