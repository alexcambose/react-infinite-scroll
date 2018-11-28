"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isotrue = void 0;

var isotrue = function isotrue(object) {
  return object && !!Object.keys(object);
};

exports.isotrue = isotrue;