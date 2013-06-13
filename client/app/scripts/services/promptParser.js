'use strict';

angular.module('clientApp')
  .factory('promptParser', function () {
    // Service logic
    // ...

    var promptRegexp = /^(?: -- MORE -- )?<([^|]*\|)?(\d+)hp (\d+)e \[?(\d+)mv\]? (\d+)wm (\d+)xp (perfect|scratched|bruised|cut|wounded|badly wounded|nastily wounded|bleeding freely|covered in blood|leaking guts|mostly dead|\?\?)?\s?([NESWUDneswud]+|none|\?\?)\s?(perfect|scratched|bruised|cut|wounded|badly wounded|nastily wounded|bleeding freely|covered in blood|leaking guts|mostly dead)?>\s*$/;

    var _public = {

      parse: function(prompt){

        var oPrompt = null;
        var aPromptMatch = prompt.match(promptRegexp);

        if ( aPromptMatch !== null) {

          oPrompt = {
            flags: aPromptMatch[1],
            hp: parseInt(aPromptMatch[2],10),
            e: parseInt(aPromptMatch[3],10),
            mv: parseInt(aPromptMatch[4],10),
            wm: parseInt(aPromptMatch[5],10),
            xp: parseInt(aPromptMatch[6],10),
            leaderState: aPromptMatch[7],
            exits: aPromptMatch[8],
            targetState: aPromptMatch[9]
          };

        }

        return oPrompt;

      }

    };



    // Public API here
    return _public;

  });

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