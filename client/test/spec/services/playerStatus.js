'use strict';

describe('Service: playerStatus', function () {

  // load the service's module
  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  // instantiate service
  var playerStatus, telnet, text;

  beforeEach(inject(function (_playerStatus_, _telnet_) {
    playerStatus = _playerStatus_;
    telnet = _telnet_;
  }));

  it('should do something', function () {
    expect(!!playerStatus).toBe(true);
  });



  it('should find the players name after the first prompt', function () {

    spyOn(telnet,'send');

    playerStatus.findName();

    telnet.relayPrompt('<188hp 320e 129mv 66wm 310352xp perfect NeS>');

    telnet.relayLines(
      'A lesser cyclops is DEAD!!\n' +
      '+--                            --+\n' +
      'You receive 5187 experience points.\n' +
      '\n' +
      '<188hp 320e 129mv 66wm 310352xp perfect NeS> score \n' +
      '                                     Tester\n' +
      '                                     -------\n' +
      '         Level: 21         Exp.Lvl: 310352\n'
    );

    expect(telnet.send).toHaveBeenCalledWith('score');
    expect(playerStatus.$scope.name).toBe('Tester');

  });


  it('should parse a group listing', function () {

    playerStatus.$scope.name = 'Moves';

    playerStatus.updateGroup();

    spyOn(telnet,'send');

    telnet.relayPrompt('<188hp 320e 129mv 66wm 310352xp perfect NeS>');

    telnet.relayLines(
      'A lesser cyclops is DEAD!!\n' +
      '+--                            --+\n' +
      'You receive 5187 experience points.\n' +
      '\n' +
      '<188hp 320e 129mv 66wm 310352xp perfect NeS> group \n' +
      'Leader: Tester\n' +
      '                                      Hits    Energy     Moves          Exp\n' +
      '                                      ----    ------     -----          ---\n' +
      '[ 21 Cle Vyn ] Tester              180/188   300/320   132/133       315539\n' +
      '[  7 Mob Hor   ] Moves                 117/117   107/107   374/374            0\n' +
      '                                                 -*-\n' +
      '[ Incognito  ] Darion                        perfect health'
    );

    telnet.relayPrompt('<180hp 300e 132mv 66wm 310352xp perfect NeS>');


    expect(telnet.send).toHaveBeenCalledWith('group');

    expect(playerStatus.$scope.leader).toBe('Tester');

    expect(playerStatus.$scope.party).toEqual({
      Tester: {
        incog: false,
        level: 21,
        class: 'Cle',
        hp: 180,
        hpMax: 188,
        e: 300,
        eMax: 320,
        mv: 132,
        mvMax: 133,
        xp: 315539
      },
      Moves: {
        incog: false,
        level: 7,
        class: 'Mob',
        hp: 117,
        hpMax: 117,
        e: 107,
        eMax: 107,
        mv: 374,
        mvMax: 374,
        xp: 0
      },
      Darion: {
        incog: true,
        status: 'perfect health'
      }
    });

  });



  it('should parse a color prompt', function () {

    //color
    telnet.relayPrompt('<B|267hp 126e 160mv 150wm 0xp scratched NEW leaking guts>');

    expect(playerStatus.$scope.self.hp).toBe(267);
    expect(playerStatus.$scope.self.xp).toBe(0);

    telnet.relayPrompt('<B|447hp 553e [374mv] 155wm 7954824xp NS>');

    expect(playerStatus.$scope.self.hp).toBe(447);

    telnet.relayPrompt(' -- MORE -- <B|440hp 553e [374mv] 155wm 7954824xp NS>');

    expect(playerStatus.$scope.self.hp).toBe(440);
    expect(playerStatus.$scope.self.xp).toBe(7954824);
  });

  it('should parse combat text', function () {

    text = 'Your eagle claw wounds a rabbit\'s furry body. [ badly wounded ]';
    text = 'An Ulannu jay\'s peck grazes Mojune\'s waist.  [ slightly scratched ]';

    text = 'Mojune\'s fire shield scorches [7] an Ulannu jay.  [ leaking guts ]';

  });



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