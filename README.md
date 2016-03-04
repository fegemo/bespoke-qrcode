[![Build Status](https://secure.travis-ci.org/fegemo/bespoke-qrcode.png?branch=master)](https://travis-ci.org/fegemo/bespoke-qrcode) [![Coverage Status](https://coveralls.io/repos/github/fegemo/bespoke-qrcode/badge.svg?branch=master)](https://coveralls.io/github/fegemo/bespoke-qrcode?branch=master)


# bespoke-qrcode

Shows a QR code for all external links in a presentation.

When an external link (one that starts with "http") is hovered, a small
qr code icon appears indicating that it can be clicked. When that happens,
a fullscreen QR code appears, with which viewers can grab their phones and
read it to navigate to the URL enconded in the image.

![Animation in which a user hovers a link, a QR code appears and is clicked, then appearing a fullscreen QR code with the encoded URL](docs/bespoke-qrcode-example.gif)

## Download

Download the [production version][min] or use a [package manager](#package-managers).

[min]: https://raw.github.com/fegemo/bespoke-qrcode/master/dist/bespoke-qrcode.min.js

### Known Issue

Because of a characteristic in Browserify (a script can't be bundled more
than once substack/node-browserify#374), this plugin can only be used in
its minified (uglified) version.

## Usage

This plugin is shipped in a [UMD format](https://github.com/umdjs/umd), meaning that it is available as a CommonJS/AMD module or browser global.

For example, when using CommonJS modules:

```js
var bespoke = require('bespoke'),
  qrcode = require('bespoke-qrcode');

bespoke.from('#presentation', [
  qrcode()
]);
```

When using browser globals:

```js
bespoke.from('#presentation', [
  bespoke.plugins.qrcode()
]);
```

There are a few options that can be used to configure the plugin:

```js
bespoke.from('#presentation', [
  qrcode({
    insertStyles: false   // Defaults to true
  })
]);
```

The option **`insertStyles`** (default: `true`) is used to ask the plugin to
inject some CSS rules to style both the small QR code icon that appears when
an external link is hovered and the modal with the actual QR code that encodes
the URL.

## Default Styling

By default, it adds some CSS rules based on that class. To see which CSS
rules are added by default, see the file [`lib/bespoke-qrcode.css`](https://github.com/fegemo/bespoke-qrcode/blob/master/lib/bespoke-qrcode.css).

## Package managers

### npm

```bash
$ npm install bespoke-qrcode
```

### Bower

```bash
$ bower install bespoke-qrcode
```

## Credits

This plugin was built with [generator-bespokeplugin](https://github.com/markdalgleish/generator-bespokeplugin).

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
