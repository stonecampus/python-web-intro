'use strict';

var path = require('path');
var fs = require('fs');
var shell = require('shelljs');
var nunjucks = require('nunjucks');
var htmlToText = require('html-to-text');
var marked = require('marked');
var liveServer = require('live-server');
var URL = require('url');

var uvw = require('uvw-node');
var SimpleIndex = require('uvw-node/uvw/simple-index');
var SimpleMeta = require('uvw-node/uvw/simple-meta');

var UnitMeta = SimpleMeta.subclass({
  newIndex: function(cntx) {
    return cntx.setIndex(this._indexCls.instance(cntx, this));
  },

  render: function(fname, obj) {
    var fpath = this.cntx.filePath(this._tmplPath || 'tmpl', fname);
    if (fpath) {
      var tmpl = uvw.readFile(fpath);
      return nunjucks.renderString(tmpl, obj);
    }
  },

  units: function() {
    var me = this;
    return this._unitDescs
      .map(unit => me.cd(unit.name))
      .filter(ctx => ctx)
      .map(ctx => ctx.index());
  },

  cp: function(name, fpath) {
    shell.cp(this.cntx.filePath(name), fpath);
  },

  info: function (depth) {
    return {
      name: this.cntx.name,
      title: this._title,
      units: depth > 0 ? this.units().map(u => u.info(depth-1)) : [],
    };
  },

  cli_info: function () {
    console.log(this.render('info.txt', this.info(1)));
  },
});

var Index = SimpleIndex.subclass({
  isReady: function() {
    return uvw.isDir(this.cntx.filePath());
  },

  units: function() {
    var me = this;
    return this.meta.units()
      .map(u => me.cd(u.cntx.name))
      .map(c => c.index());
  },

  info: function(depth) {
    return uvw.assign(this.meta.info(), {
      baseDir: this.cntx.filePath(),
      curDir: process.cwd(),
      relPath: this.cntx.relPathFrom(),
      ready: this.isReady(),
      units: this.units().map(u => u.info(depth-1)),
    });
  },

  cli_info: function () {
    console.log(this.meta.render('info.txt', this.info(1))); 
  },
  cli_more: function () {
    console.log(this.meta.render('more.txt', this.info(1))); 
  },

  cli_serve: function(args, opts) {
    if (!this._openUrl) return 'Nothing to serve';

    var relPath = this.cntx.relPathFrom();
    if (relPath) return 'Please cd ' + relPath;

    var params = {
      file: this._openUrl,
      port: opts.port > 0 ? opts.port : 8080,
      host: opts.host || 'localhost',
      root: this.cntx.baseDir,
      open: '/' + this._openUrl, //true, // When false, it won't load your browser by default.
      ignore: 'node_modules,.uvw,_meta',
      //file: 'hello.html',
      //wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
      //mount: [['/components', './node_modules']], // Mount a directory to a route.
      logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
      //middleware: [redir]
    };

    /*function redir(req, res, next) {
      var query = URL.parse(req.url, true).query;
      if (query.url) {
        res.statusCode = 302;
        res.setHeader('Location', query.url);
        res.setHeader('Content-Length', '0');
        return res.end();
      }

      next();
    }*/

    liveServer.start(params);
  },

});

UnitMeta.Index = Index;

module.exports = UnitMeta;

