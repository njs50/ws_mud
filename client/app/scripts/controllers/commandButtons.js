'use strict';

angular.module('clientApp')
  .controller('CommandButtonsCtrl',
    ['$scope', 'buttons', 'telnet', 'keypress', '$dialog', function ($scope, buttons, telnet,keypress,$dialog) {

    $scope.buttons = buttons;
    $scope.bEditMode = false;
    $scope.editIndex = -1;

    keypress.$scope.$on(keypress.events.keydown,function(ngevent, e){

      var key = keypress.getEventKey(e);
      var idx = -1;

      switch(key) {
      case 'minus':
        idx = 10;
        break;
      case 'equal':
        idx = 11;
        break;
      case 0:
        idx = 9;
        break;
      default:
        if (typeof key === 'number') {
          idx = key - 1;
        }
      }

      if (idx !== -1) {
        $scope.clickButton(idx);
      }

    });


    $scope.clickButton = function(key) {

      if ($scope.bEditMode) {
        $scope.edit(buttons.$scope.aActiveButtons[key]);
      } else {
        if(buttons.$scope.aActiveButtons.length > key &&
          buttons.$scope.aActiveButtons[key].command.length) {
          telnet.send(buttons.$scope.aActiveButtons[key].command);
        }
        buttons.resetButtons();
      }

    };

    $scope.toggleEdit = function(){
      $scope.bEditMode = !$scope.bEditMode;
    };




    $scope.edit = function(item){

      var itemToEdit = item;

      $dialog.dialog({
        controller: 'EditButtonCtrl',
        templateUrl: 'templates/editButton.tpl.html',
        resolve: {item: function(){ return angular.copy(itemToEdit);} }
      })

        .open()

        .then(function(result) {
          if(result) {
            angular.copy(result, itemToEdit);
          }
          itemToEdit = undefined;
        })

      ;
    };

    $scope.indexToKey = function(index) {

      switch (index) {
      case 9:
        return 0;
      case 10:
        return '-';
      case 11:
        return '=';
      default:
        return index + 1;
      }

    };



  }])

  .controller('EditButtonCtrl', ['$scope', 'dialog', 'item', function($scope, dialog, item){

    $scope.item = item;

    $scope.save = function() {
      dialog.close($scope.item);
    };

    $scope.close = function(){
      dialog.close(undefined);
    };

  }])

;



