var bespoke = require('bespoke'),
qrcode = require('../../lib-instrumented/bespoke-qrcode.js'),
simulant = require('simulant'),

deck,
createDeck = function(options) {
  var parent = document.createElement('article');
  document.body.appendChild(parent);
  parent.innerHTML = '<section><a href="/local">Relative link</a></section><section><a href="http://github.com/fegemo/">Absolute link</a></section>';

  deck = bespoke.from(parent, [
    qrcode(options)
  ]);
};

describe('bespoke-qrcode', function() {

  // This test HAS TO BE the first one, because the plugin uses the package
  // insert-css, which does not include the same css more than once.
  // Because of that, we can't remove the stylesheet after each test, as we
  // would be unable to put it back again (insert-css's internal silly cache)
  describe('when styled by the plugin', function() {
    it('should inject some CSS onto the document', function() {
      var numberOfStylesheets = document.styleSheets.length;
      createDeck({ insertStyles: true });
      expect(document.styleSheets.length).toBeGreaterThan(numberOfStylesheets);
    });
  });

  describe('when NOT STYLED by the plugin', function() {
    it('should NOT inject CSS onto the document', function() {
      var numberOfStylesheets = document.styleSheets.length;
      createDeck({ insertStyles: false });
      expect(document.styleSheets.length).toEqual(numberOfStylesheets);
    });
  });

  describe('features', function() {

    beforeEach(function() {
      createDeck();
    });

    it('should prepend an icon on every absolute url hyperlink on the presentation', function() {
      var absoluteLink = deck.parent.querySelectorAll('a[href^="http"] > .bespoke-qrcode-icon');
      expect(absoluteLink.length).toBe(1);
    });

    it('should NOT prepend an icon on relative links', function() {
      var relativeLink = deck.parent.querySelectorAll('a:not([href^="http"]) > .bespoke-qrcode-icon');
      expect(relativeLink.length).toBe(0);
    });

    it('should open a modal when icons are clicked', function() {
      var icon = deck.parent.querySelector('.bespoke-qrcode-icon'),
      modal = deck.parent.parentElement.querySelector('.bespoke-qrcode-modal');
      simulant.fire(icon, 'click');

      // this is not working... need to know why
      setTimeout(function() {
        expect(modal.classList.contains('active')).toBe(true);
      }, 100);
    });

    it('it should dismiss the modal when it is clicked', function() {
      var modal = deck.parent.parentElement.querySelector('.bespoke-qrcode-modal');
      modal.classList.add('active');
      simulant.fire(modal, 'click');

      expect(modal.classList.contains('active')).toBe(false);
    });
  });
});
