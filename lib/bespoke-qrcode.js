var fs = require('fs');
var insertCss = require('insert-css');
var qr = require('qr-image');

var optionsWithDefaults = function(defaults, options) {
    options = typeof options === 'object' ? options : {};
    Object.keys(defaults).forEach(function(option) {
      if (typeof options[option] === 'undefined') {
        options[option] = defaults[option];
      }
    });
    return options;
  };

module.exports = function(options) {
  options = optionsWithDefaults({
    activationKey: 27,
    insertStyles: true
  }, options);

  return function(deck) {
    var modal,
      links,
      toggleModal = function toggleModal(show) {
        modal.classList.toggle('active', show);
      };

    // grab all hyperlinks
    var links = deck.parent.querySelectorAll('a[href^="http"]');

    if (links.length > 0) {

      // append icon to each one
      Array.prototype.forEach.call(links, function(a) {
        var icon = document.createElement('i');
        icon.classList.add('bespoke-qrcode-icon');
        icon.dataset.url = a.getAttribute('href');

        a.insertBefore(icon, a.children[0]);

        // upon click on the icon, show modal
        icon.addEventListener('click', function(e) {
          // a <a> was clicked - need to disabllow default browser navigation
          e.preventDefault();

          modal.innerHTML = qr.imageSync(e.currentTarget.dataset.url, { type: 'svg' });

          toggleModal(true);
        });
      });

      // append modal
      modal = document.createElement('aside');
      modal.classList.add('bespoke-qrcode-modal');
      deck.parent.parentElement.appendChild(modal);

      // modal close
      modal.addEventListener('click', toggleModal.bind({}, false));

      // inserts the css if necessary
      if (options.insertStyles) {
        try {
            insertCss(fs.readFileSync(__dirname + '/bespoke-qrcode.min.css', 'utf8'));
        } catch(e) {
          console.error(e);
        }
      }

    }
  };
};
