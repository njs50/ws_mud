'use strict';

angular.module('clientApp')
  .directive('commandBar', function () {


    return {
      template: '<input ng-controller="CommandBarCtrl" ng-model="command" type="text" class="pull-bottom" style="width:100%">',
      restrict: 'E',
      replace: true,
      link: function postLink(scope, element) {

        // bind the keydown event and prevent default where relevant
        element.off('keydown').bind('keydown', function (e) {
          scope.keyDown(e);
        });

        // give the command bar the initial focus
        element[0].focus();

        var bHasFocus = true;

        // track focus leaving and entering the command bar
        element.bind('blur', function() {
          bHasFocus = false;
        });
        element.bind('focus', function() {
          bHasFocus = true;
        });


        // keep focus in the command bar, unless it goes to some other input...
        $(window).off('keydown').on('keydown', function(e) {

          if (!bHasFocus &&
              ($.inArray(document.activeElement.tagName.toLowerCase(), ['input','textarea']) === -1) ) {

            //redirect input (so keypresses land in the right location)
            element[0].focus();

            //retrigger event in case anything was listening for it
            element.trigger(e);


          }

        });

      }
    };
  });
