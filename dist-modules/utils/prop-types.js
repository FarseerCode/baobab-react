'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpers = require('./helpers');

function errorMessage(propName, what) {
  return 'prop type `' + propName + '` is invalid; it must be ' + what + '.';
} /**
   * Baobab-React Custom Prop Types
   * ===============================
   *
   * PropTypes used to propagate context safely.
   */
exports.default = {
  baobab: function baobab(props, propName) {
    if (!(propName in props)) return;

    if (!(0, _helpers.isBaobabTree)(props[propName])) return new Error(errorMessage(propName, 'a Baobab tree'));
  }
};