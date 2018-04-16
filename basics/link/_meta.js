'use strict';

var opn = require('opn');
var uvw = require('uvw-node');

var UnitMeta = require('../../meta/unit');

var Index = UnitMeta.Index.subclass({
  cli_start: function() {
    if (this.cntx.hasFile('link.html')) {
      console.log('Started already, try');
      console.log('  uvw . open');
    } else {
      this.meta.cp('link.html', this.cntx.filePath('link.html'));
      this.meta.cp('back.html', this.cntx.filePath('back.html'));
      console.log('html files ready');
    }
  },

  cli_open: function () {
    opn(this.cntx.filePath('link.html'));
    console.log('Tasks:');
    console.log();
    console.log('  1. study page source from your Browser');
    console.log('  2. click hyper link and back');
  },
});

var Meta = UnitMeta.subclass({
  _indexCls: Index,
  _unitDescs: [], 
  _title: 'HTML Hyperlinks',

  info: function () {
    return {
      name: this.cntx.name,
      title: 'Hyperlinks',
    };
  },
});

module.exports = Meta;

