'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.curry = curry;
exports.solveMapping = solveMapping;
exports.isBaobabTree = isBaobabTree;
/**
 * Baobab-React Helpers
 * =====================
 *
 * Miscellaneous helper functions.
 */

/**
 * Simple curry function.
 */
function curry(fn, arity) {
  return function f1() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length >= arity) {
      return fn.apply(null, args);
    } else {
      return function f2() {
        for (var _len2 = arguments.length, args2 = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args2[_key2] = arguments[_key2];
        }

        return f1.apply(null, args.concat(args2));
      };
    }
  };
}

/**
 * Solving the mapping given to a higher-order construct.
 */
function solveMapping(mapping, props, context) {
  if (typeof mapping === 'function') mapping = mapping(props, context);

  return mapping;
}

/**
 * Determines if the given tree is a Baobab tree.
 * FIXME: if Baobab ever implements something like Array.isArray we should use
 * that instead of relying in the internal _identity = '[object Baobab]' value.
 * See https://github.com/Yomguithereal/baobab/blob/master/src/baobab.js#L111
 */
function isBaobabTree(tree) {
  return !!(tree && typeof tree.toString === 'function' && tree.toString() === '[object Baobab]');
}