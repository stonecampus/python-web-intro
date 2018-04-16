'use strict';

var path = require('path');
var fs = require('fs');
var shell = require('shelljs');
var nunjucks = require('nunjucks');
var htmlToText = require('html-to-text');
var marked = require('marked');

var uvw = require('uvw-node');
var SimpleMeta = require('uvw-node/uvw/simple-meta');
var SimpleIndex = require('uvw-node/uvw/simple-index');
var JsonStore = require('uvw-node/db/file-json-store');

var packageBase = path.resolve(__dirname, '..');

var UNITS = [{
  name: 'basics',
}];

var Meta = SimpleMeta.subclass({
  init: function(cntx) {
    this.cntx = cntx || uvw.packageContext(packageBase, this);
  },

  newIndex: function(cntx) {
    return Index.instance(cntx, this);
  },

  render: function(fname, obj) {
    var tmpl = uvw.readFile(__dirname, 'tmpl', fname);
    var txt = nunjucks.renderString(tmpl, obj);
    return txt;
  },

  units: function() {
    var me = this;
    return UNITS
      .map(unit => me.cd(unit.name))
      .filter(ctx => ctx)
      .map(ctx => ctx.index());
  },

  cli_info: function () {
    console.log(this.render('meta-info.txt', {
      title: 'Python Web Get Started',
      units: this.units().map(u => u.info()),
    }));
  },

  uvw_init: function (args, opts) {
    var fpath = path.resolve(__dirname);
    var spec = { 'meta-proto': fpath };
    var ret = uvw.initPackage(spec, {
      baseDir: process.cwd(),
      subDir: args[0]
    });
    if (typeof ret === 'string') console.error(ret);
  },
});

var Store = JsonStore.subclass({
  inState: function(state) {
    var cur = this.load('state');
    return cur === state || !cur && state === 'init';
  },
});

var Index = SimpleIndex.subclass({
  init: function(cntx, meta) {
    SimpleIndex.init.call(this, cntx, meta);

    var dbPath = this.cntx.filePath('.uvw', 'json.db'); 
    this.db = Store.instance(dbPath);
  },

  units: function() {
    var me = this;
    return this.meta.units()
      .map(u => me.cd(u.cntx.name))
      .map(c => c.index());
  },

  cli_info: function () {
    var infos = this.units().map(u => u.info());

    console.log(this.meta.render('info.txt', {
      title: 'Python Web Get Started',
      units: infos,
    }));
  },

  cli_open: function(args, opts) {
    var name = args[0] || opts.name;
    if (name) {
      if (!this.cd(name)) return 'invalid unit ' + name;

      var fpath = this.cntx.filePath(name);
      shell.mkdir('-p', fpath);
      if (shell.test('-d', fpath)) return 'unit ' + name + ' ready';

      return 'sorry cannot create unit ' + name;
    }
  },
});

module.exports = Meta;
