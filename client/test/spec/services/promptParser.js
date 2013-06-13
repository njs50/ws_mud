'use strict';

describe('Service: promptParser', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var promptParser;
  beforeEach(inject(function (_promptParser_) {
    promptParser = _promptParser_;
  }));

  it('should do something', function () {
    expect(!!promptParser).toBe(true);
  });



  it('should parse a color prompt', function () {

    //color
    var oPrompt = promptParser.parse('<B|267hp 126e 160mv 150wm 0xp scratched NEW leaking guts>');

    expect(oPrompt.hp).toBe(267);
    expect(oPrompt.xp).toBe(0);

    oPrompt = promptParser.parse('<B|447hp 553e [374mv] 155wm 7954824xp NS>');

    expect(oPrompt.hp).toBe(447);

    oPrompt = promptParser.parse(' -- MORE -- <B|440hp 553e [374mv] 155wm 7954824xp NS>',{});

    expect(oPrompt.hp).toBe(440);
    expect(oPrompt.xp).toBe(7954824);

  });

  it('should return null on an invalid prompt', function () {

    //color
    var oPrompt = promptParser.parse('      Choice:');
    expect(oPrompt).toBe(null);

  });


});
