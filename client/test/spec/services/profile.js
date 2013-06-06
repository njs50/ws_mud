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

    var aButtons = profile.getButtons('wombat');

    expect(aButtons.length).toBe(2);
    expect(aButtons[1].command).toBe('escape');

  });





});
