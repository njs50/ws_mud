'use strict';

describe('Service: profile', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var profile;
  beforeEach(inject(function (_profile_) {
    profile = _profile_;
  }));

  it('should do something', function () {
    expect(!!profile).toBe(true);
  });



  it('should store and retrieve the users buttons', function () {

    profile.setButtons('wombat', [
      {command: 'flee', label:'run like a little girl'},
      {command: 'escape', label:'vanish like a ninja'}
    ]);

    var aButtons = profile.getButtons('not there');

    expect(aButtons.length).toBe(0);

    aButtons = profile.getButtons('wombat');
    expect(aButtons.length).toBe(2);
    expect(aButtons[1].command).toBe('escape');

  });

  it('should return an empty array if a non existant button set is requested', function () {

    var aButtons = profile.getButtons('not there');
    expect(aButtons.length).toBe(0);

  });



  it('should store and retrieve the users buttons from localStorage', function () {

    profile.setButtons('default', [
      {command: 'flee', label:'run like a little girl'},
      {command: 'escape', label:'vanish like a ninja'}
    ]);

    profile.save();

    profile.load();

    var aButtons = profile.getButtons('default');

    expect(aButtons.length).toBe(2);
    expect(aButtons[1].command).toBe('escape');

    // if not in storage the defaults should be loaded
    $.jStorage.deleteKey('buttons');
    profile.load();

    aButtons = profile.getButtons('default');
    expect(aButtons.length).toBe(6);
    expect(aButtons[1].command).toBe('skin corpse');


  });



});
