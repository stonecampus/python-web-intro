'use strict';

var path = require('path');
var UnitMeta = require('../meta/unit');

var UNITS = [
  { name: 'hello' },
  { name: 'link' },
  { name: 'image' },
  { name: 'more' },
  { name: 'server' },
];

var Index = UnitMeta.Index.subclass({
});

var Meta = UnitMeta.subclass({
  //_tmplPath: path.join('meta', 'tmpl'),
  _indexCls: Index,
  _unitDescs: UNITS,
  _title: 'Web 入門',
});

module.exports = Meta;

