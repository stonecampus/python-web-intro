'use strict';

var opn = require('opn');

var uvw = require('uvw-node');
var UnitMeta = require('../../meta/unit');

var Index = UnitMeta.Index.subclass({
  _openUrl: 'more.html',

  cli_start: function() {
    if (this.cntx.hasFile('more.html')) {
      console.log('Started already, try');
      console.log('  uvw . open');
    } else {
      this.meta.cp('more.html', this.cntx.filePath('more.html'));
      console.log('more.html ready');
    }
  },

  cli_open: function () {
    opn(this.cntx.filePath('more.html'));
    console.log('Tasks:');
    console.log();
    console.log('  1. study page source for comment');
    console.log('  2. study page source for character references');
  },
});

var Meta = UnitMeta.subclass({
  _indexCls: Index,
  _unitDescs: [], 

  info: function () {
    return {
      name: this.cntx.name,
      title: 'A Little More HTML',
    };
  },
});

module.exports = Meta;

