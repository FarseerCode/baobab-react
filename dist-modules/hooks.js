'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.useRoot = useRoot;
exports.useBranch = useBranch;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _helpers = require('./utils/helpers');

var _baobab = require('baobab');

var _baobab2 = _interopRequireDefault(_baobab);

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeError = _baobab2.default.helpers.makeError,
    isPlainObject = _baobab2.default.type.object;

function invalidMapping(name, mapping) {
  throw makeError('baobab-react/hooks.useBranch: given cursors mapping is invalid (check the "' + name + '" component).', { mapping: mapping });
}

function useRoot(tree) {
  if (!(0, _helpers.isBaobabTree)(tree)) throw makeError('baobab-react/hooks.useRoot: given tree is not a Baobab.', { target: tree });

  var _useState = (0, _react.useState)(function () {
    return function (_ref) {
      var children = _ref.children;

      return _react2.default.createElement(_context2.default.Provider, {
        value: { tree: tree }
      }, children);
    };
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  (0, _react.useEffect)(function () {
    setState(function () {
      return function (_ref2) {
        var children = _ref2.children;

        return _react2.default.createElement(_context2.default.Provider, {
          value: { tree: tree }
        }, children);
      };
    });
  }, [tree]);

  return state;
}

function useBranch(cursors, deps) {
  if (!isPlainObject(cursors) && typeof cursors !== 'function') invalidMapping(name, cursors);

  var context = (0, _react.useContext)(_context2.default);

  if (!context || !(0, _helpers.isBaobabTree)(context.tree)) throw makeError('baobab-react/hooks.useBranch: tree is not available.');

  var _useState3 = (0, _react.useState)(function () {
    var mapping = typeof cursors === 'function' ? cursors(context) : cursors;
    var obj = context.tree.project(mapping);
    obj.dispatch = function (fn) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return fn.apply(undefined, [context.tree].concat(args));
    };
    return obj;
  }),
      _useState4 = _slicedToArray(_useState3, 2),
      state = _useState4[0],
      setState = _useState4[1];

  (0, _react.useEffect)(function () {
    var mapping = typeof cursors === 'function' ? cursors(context) : cursors;
    var watcher = context.tree.watch(mapping);

    var updateValue = function updateValue() {
      var obj = watcher.get();
      obj.dispatch = function (fn) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        return fn.apply(undefined, [context.tree].concat(args));
      };
      setState(obj);
    };

    // cursors have changed - update value immediately
    updateValue();

    watcher.on('update', updateValue);

    return function () {
      return watcher.release();
    };
  }, deps || []);

  return state;
}