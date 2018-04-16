'use strict';

var opn = require('opn');

var uvw = require('uvw-node');
var UnitMeta = require('../../meta/unit');

var Index = UnitMeta.Index.subclass({
  _openUrl: 'image.html',

  cli_start: function() {
    if (this.cntx.hasFile('image.html')) {
      console.log('Started already, try');
      console.log('  uvw . open');
    } else {
      this.meta.cp('image.html', this.cntx.filePath('image.html'));
      console.log('image.html ready');
    }
  },

  cli_open: function () {
    opn(this.cntx.filePath('image.html'));
    console.log('Tasks:');
    console.log();
    console.log('  1. see page source from your Browser');
    console.log('  2. modify image.html and refresh');
    console.log('  3. add an image file and change image.html');
  },
});

var Meta = UnitMeta.subclass({
  _indexCls: Index,
  _unitDescs: [], 
  //_title: 'HTML Quick Starter',

  info: function () {
    return {
      name: this.cntx.name,
      title: 'Showing images',
    };
  },
});

module.exports = Meta;

