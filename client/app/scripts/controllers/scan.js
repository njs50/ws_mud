'use strict';

angular.module('clientApp')

  .controller('ScanCtrl', function ($scope) {

    $scope.adjacentMobs = {
      'north': ['fragile ancient sage'],
      'east': ['medienne guard member','gnomish youth','old wise elf'],
      'south': ['moorhound','forest ranger'],
      'west' : []
    };




  });

/*

       north : a pigeon, a Medienne guard
        east : a candy-maker
       south : a Medienne guard, a Medienne Knight, a knight's heavy charger,
               a silver-haired elf with piercing blue eyes
        west : a heavy war horse, a war dog, a pack mule,
               a tall, well-built horse, a muscular, yet sleek steed,
               a black horse with hooves and eyes of flame

*/