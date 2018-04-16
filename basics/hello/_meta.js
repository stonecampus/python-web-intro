'use strict';

var opn = require('opn');
var uvw = require('uvw-node');

var UnitMeta = require('../../meta/unit');

var Index = UnitMeta.Index.subclass({
  _openUrl: 'hello.html',

  cli_start: function() {
    if (this.cntx.hasFile('hello.html')) {
      console.log('Started already, try');
      console.log('  uvw . open');
    } else {
      this.meta.cp('hello.html', this.cntx.filePath('hello.html'));
      console.log('hello.html ready');
    }
  },

  cli_open: function () {
    opn(this.cntx.filePath('hello.html'));
    console.log('Tasks:');
    console.log();
    console.log('  1. see page source from your Browser');
    console.log('  2. modify hello.html and refresh');
    console.log('  3. see dynamic structure of the HTML from your Browser');
    console.log('  4. change dynamic structure directly from your Browser');
  },
});

var Meta = UnitMeta.subclass({
  _indexCls: Index,
  _unitDescs: [], 
  _title: 'HTML Quick Starter',

  info: function () {
    return {
      name: this.cntx.name,
      title: 'Hello HTML',
    };
  },
});

module.exports = Meta;

