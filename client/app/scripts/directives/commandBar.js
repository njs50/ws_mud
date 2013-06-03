'use strict';

angular.module('clientApp')
  .directive('commandBar', function () {


    return {
      templateUrl: 'templates/commandBar.tpl.html',
      //template: '<foo></foo>'
      restrict: 'E',
      replace: true,
      scope: false,
      link: function postLink(scope, element) {

        // bind the keydown event and prevent default where relevant
        element.off('keydown').bind('keydown', function (e) {
          scope.keyDown(e);
        });

        // give the command bar the initial focus
        var inputField = element.find('input').eq(0).focus();

        var bHasFocus = true;

        // track focus leaving and entering the command bar
        inputField.bind('blur', function() {
          bHasFocus = false;
        });
        inputField.bind('focus', function() {
          bHasFocus = true;
        });


        // keep focus in the command bar, unless it goes to some other input...
        $(window).off('keydown').on('keydown', function(e) {

          if (!bHasFocus &&
             ($.inArray(e.which, [0,16,17,18,91,93]) === -1) &&
              (!e.ctrlKey && !e.metaKey) &&
              ($.inArray(document.activeElement.tagName.toLowerCase(), ['input','textarea']) === -1) ) {

            //redirect input (so keypresses land in the right location)
            inputField.focus();

            //retrigger event in case anything was listening for it
            element.trigger(e);

          }

        });

      }
    };
  });
