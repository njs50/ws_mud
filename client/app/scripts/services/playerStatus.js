'use strict';

angular.module('clientApp')
  .factory('playerStatus', ['$rootScope', 'telnet', '$q',
    function ($rootScope, telnet, $q) {
    // Service logic
    // ...

    var $scope = $rootScope.$new();

    $scope.events = {
      fullPartyUpdate: 'ALL_PARTY_INFO_UPDATED'
    };

/*

;; perfect health     (100%) ::  perfect
;; slightly scratched (90%+) ::  scratched
;; few bruises        (80%+) ::  bruised
;; some cuts          (70%+) ::  cut
;; several wounds     (60%+) ::  wounded
;; badly wounded      (50%+) ::  badly wounded
;; many nasty wounds  (40%+) ::  nastily wounded
;; bleeding freely    (30%+) ::  bleeding freely
;; covered in blood   (20%+) ::  covered in blood
;; leaking guts       (10%+) ::  leaking guts
;; mostly dead        (0%+)  ::  mostly dead
;; in different room         ::  ??

*/


    var promptRegexp = /^(?: -- MORE -- )?<([^|]*\|)?(\d+)hp (\d+)e \[?(\d+)mv\]? (\d+)wm (\d+)xp (perfect|scratched|bruised|cut|wounded|badly wounded|nastily wounded|bleeding freely|covered in blood|leaking guts|mostly dead|\?\?)?\s?([NESWUDneswud]+|none)\s?(perfect|scratched|bruised|cut|wounded|badly wounded|nastily wounded|bleeding freely|covered in blood|leaking guts|mostly dead)?>\s*$/;

    $scope.name = 'TFE';
    $scope.leader = '';
    $scope.party = {};

    $scope.self = {
      hp: 1,
      hpMax: 1,
      e: 1,
      eMax: 1,
      mv: 1,
      mvMax: 1
    };

    var nextPrompt = function(regexp, cmd, fn) {

      var promptWaitUnbind = telnet.$scope.$on(telnet.$scope.telnetEvents.parsePrompt, function(e, prompt) {
        if (prompt.match(regexp)){
          promptWaitUnbind();
          if (fn !== undefined) {
            fn();
          }
          if (cmd !== '') {
            telnet.send(cmd);
          }
        }
      });

    };


    // update self whenever a prompt is parsed
    telnet.$scope.$on(telnet.$scope.telnetEvents.parsePrompt, function(e, prompt) {

      var aMatch = prompt.match(promptRegexp);

      if (aMatch){
        $scope.$apply(function(){

          // 1 = flags
          $scope.self.hp = parseInt(aMatch[2],10);
          $scope.self.e = parseInt(aMatch[3],10);
          $scope.self.mv = parseInt(aMatch[4],10);
          // 5 = min party moves
          $scope.self.xp = parseInt(aMatch[6],10);
          // 7 = tank status
          // 8 = exits
          // 9 = target status
        });
      }

    });


    // update party whenever group data is parsed
    telnet.$scope.$on(telnet.$scope.telnetEvents.parseLine, function(e, line) {
      var aMatch = line.match(/^Leader:\s*(.*)\s*$/);
      if (aMatch) {

        $scope.leader = aMatch[1];
        var party = {};

        var partyFinderUnbind = telnet.$scope.$on(telnet.$scope.telnetEvents.parseLine, function(e, line) {

          var pMatch = line.match(/^\[\s+(\d+)\s+(\w+)\s+\S+\s+\]\s+(\S+)\s*(\d+)\/(\d+)\s+(\d+)\/(\d+)\s+(\d+)\/(\d+)\s+(\d+)\s*$/);

          if (pMatch) {

            party[pMatch[3]] = {
              incog: false,
              level: parseInt(pMatch[1],10),
              class: pMatch[2],
              hp: parseInt(pMatch[4],10),
              hpMax: parseInt(pMatch[5],10),
              e: parseInt(pMatch[6],10),
              eMax: parseInt(pMatch[7],10),
              mv: parseInt(pMatch[8],10),
              mvMax: parseInt(pMatch[9],10),
              xp: parseInt(pMatch[10],10)
            };


          } else {

            var incogMatch = line.match(/^\[\s*Incognito\s*\]\s+(\S+)\s+(.*)\s*$/);
            if (incogMatch) {
              party[incogMatch[1]] = {incog: true, status: incogMatch[2]};
            }

          }

        });

        nextPrompt(promptRegexp,'',function(){
          partyFinderUnbind();
          $scope.$apply(function(){
            $scope.party = party;
            if (party.hasOwnProperty($scope.name)) {
              $scope.self = party[$scope.name];
            }
          });
          $scope.$broadcast($scope.events.fullPartyUpdate);
        });

      }
    });






    var _public = {

      '$scope': $scope,

      findName: function(){
        var deferred = $q.defer();
        nextPrompt(promptRegexp, 'score', function(){
          var lastLine = '';
          var nameFinderUnbind = telnet.$scope.$on(telnet.$scope.telnetEvents.parseLine, function(e, line) {
            if (line.match(/^\s*-+\s*$/)) {
              nameFinderUnbind();
              $scope.$apply(function(){
                $scope.name = $.trim(lastLine);
                deferred.resolve($scope.name);
              });
            }
            lastLine = line;
          });
        });
        return deferred.promise;
      },

      updateGroup: function() {

        var deferred = $q.defer();

        nextPrompt(promptRegexp, 'group', function(){
          var waitForUpdateUnbind = $scope.$on($scope.events.fullPartyUpdate,function(){
            waitForUpdateUnbind();
            deferred.resolve($scope.party);
          });
        });

        return deferred.promise;
      }

    };




    // Public API here
    return _public;

  }]);




/*

const char* prompt_color =
  "?p' -- MORE -- '<%f?f|@R%hhp@n @G%ee@n @B?m'[%mmv]'!m'%vmv'@n %gwm %xxp?l' %C' %d?b' %c'> ";


Default, Immortal, Cleric, Warrior, Simple, Complex, Color

The following are if statements.  The letter after the expression or the
phrase surrounded by single quotes is evaluated if the statement is true.
For if not, use an exclamation mark instead of a question mark.

?p - has page info
?m - is mounted
?f - has flags set
?b - is in battle
?l - is following someone

The next set of variables allows the inclusion of various quanties in
your prompt.  Some of them can be capitalized to get maximum values for
that statistic.

%h  - hitmarks
%e  - energy
%v  - movement points
%m  - mounts moves
%x  - experience points
%f  - flags
%t  - mud time
%T  - real time (use time -z to set zone)
%\  - carriage return
%c  - enemies condition
%C  - leader's condition
%s  - condition of self
%d  - seen exits
%g  - lowest moves of any group member
%G  - gossip points

As an example the default prompt is:

?p'-- MORE -- '<%f?f|%hhp %ee ?m'[%mmv]'!m'%vmv' ?b'%c'!b'%d'>

Various option flags appear in your prompt when applicable.  See prompt
flags for more information.

<188hp 320e 131mv> prompt flags

flagsprompt cleric

<188hp 320e 131mv> help prompt flags
Topic: prompt flags

DESCRIPTION

Several options and room status information are displayed in player
prompts.  The following is a short summary of these bits of information:

c - camouflaged
h - hidden
i - invisible
P - Player killing ok
p - parry on
S - sanctuary
s - Sneaking
t - tracking
x - searching

*/