window.deck = bespoke.from('article', [
  bespoke.plugins.keys(),
  bespoke.plugins.touch(),
  bespoke.plugins.classes(),
  bespoke.themes.cube(),
  bespoke.plugins.bullets('li'),
  bespoke.plugins.qrcode()
]);
