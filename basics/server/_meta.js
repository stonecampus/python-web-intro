'use strict';

var path = require('path');
var opn = require('opn');

var uvw = require('uvw-node');
var UnitMeta = require('../../meta/unit');

var Index = UnitMeta.Index.subclass({
  _openUrl: 'index.html',

  cli_start: function() {
    if (this.cntx.hasFile('hello.html')) {
      console.log('Started already, try');
      console.log('  python3 -m http.server');
      console.log();
      console.log('then open browser at http://localhost:8000');
    } else {
      var fpath = path.join('..', 'hello', 'hello.html');
      this.meta.cp(fpath, this.cntx.filePath('hello.html'));
      fpath = path.join('..', 'link', 'link.html');
      this.meta.cp(fpath, this.cntx.filePath('link.html'));
      fpath = path.join('..', 'link', 'back.html');
      this.meta.cp(fpath, this.cntx.filePath('back.html'));
      fpath = path.join('..', 'image', 'image.html');
      this.meta.cp(fpath, this.cntx.filePath('image.html'));
      fpath = path.join('..', 'more', 'more.html');
      this.meta.cp(fpath, this.cntx.filePath('more.html'));
      console.log('html files ready. Try');
      console.log('  python3 -m http.server');
      console.log();
      console.log('then open browser at http://localhost:8000');

    }
  },

  cli_next: function() {
    if (this.cntx.hasFile('index.html')) {
      console.log('index.html exists already, try');
    } else {
      this.meta.cp('index.html', this.cntx.filePath('index.html'));
      console.log('index.html ready');
    }
    console.log('Try');
    console.log('  python3 -m http.server');
    console.log();
    console.log('then open browser at http://localhost:8000');
  },

  cli_open: function () {
    opn(this.cntx.filePath('image.html'));
    console.log('Tasks:');
    console.log();
    console.log('  1. see page source from your Browser');
    console.log('  2. modify hello.html and refresh');
    console.log('  3. add an image file and change image.html');
  },
});

var Meta = UnitMeta.subclass({
  _indexCls: Index,
  _unitDescs: [], 

  info: function () {
    return {
      name: this.cntx.name,
      title: 'Showing images',
    };
  },
});

module.exports = Meta;

