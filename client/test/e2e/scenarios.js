describe("end to end test suite for ws mud client", function() {


  describe('homepage view',function(){

    beforeEach(function() {
      browser().navigateTo('/index.html#/');
    });

    it("should go to the homepage", function() {
      expect(browser().location().url()).toBe('/');
      expect(element('h1').text()).toMatch(/'Allo, 'Allo!/);
    });

  });

  describe('about view', function() {

    beforeEach(function() {
      browser().navigateTo('/index.html#/about');
    });

    it('should display static page with info about tfe', function() {
      expect(browser().location().url()).toBe('/about');
      expect(element('h2').text()).toMatch(/Hello, and welcome to MUDding\./);
    });

  });


});
