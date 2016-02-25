var bespoke = require('bespoke'),
  qrcode = require('../../lib-instrumented/bespoke-qrcode.js'),
  simulant = require('simulant'),

  deck,
  createDeck = function(options, classOnParent) {
    var parent = document.createElement('article');
    parent.innerHTML = '<section><a href="/local">Relative link</a></section><section><a href="http://github.com/fegemo/">Absolute link</a></section>';
    if (typeof classOnParent === 'string') {
      parent.classList.add(classOnParent)
    }

    deck = bespoke.from(parent, [
      qrcode(options)
    ]);
  };

describe('bespoke-qrcode', function() {

  beforeEach(function() {
    createDeck({});
  });

  describe('it should prepend an icon on every absolute url hyperlink on the presentation', function() {
    var absoluteLink = deck.parent.querySelectorAll('a')[1];
    expect(absoluteLink.firstChild.classList.contains('bespoke-qrcode-icon')).toBe(true);
  });

  describe('it should NOT prepend an icon on relative links', function() {
    var relativeLink = deck.parent.querySelectorAll('a')[0];
    expect(relativeLink.firstChild.classList.contains('bespoke-qrcode-icon')).toBe(false);
  });

  describe('it should open a modal when icons are clicked', function() {
    var link = deck.parent.querySelector('bespoke-qrcode-icon'),
      modal = deck.parent.querySelector('bespoke-qrcode-modal');
    simulant.fire(link, 'click');

    expect(modal.classList.contains('active')).toBe(true);
  });

  describe('it should dismiss the modal when it is clicked', function() {
    var modal = deck.parent.querySelector('bespoke-qrcode-modal');
    modal.classList.add('active');
    simulant.fire(modal, 'click');

    expect(modal.classList.contains('active')).toBe(false);
  });
});
