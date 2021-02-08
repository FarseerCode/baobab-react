'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.branch = exports.root = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _baobab = require('baobab');

var _baobab2 = _interopRequireDefault(_baobab);

var _helpers = require('./utils/helpers');

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Baobab-React Higher Order Component
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ====================================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ES6 state of the art higher order component.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var makeError = _baobab2.default.helpers.makeError,
    isPlainObject = _baobab2.default.type.object;

/**
 * Helpers
 */
function displayName(Component) {
  return Component.name || Component.displayName || 'Component';
}

function invalidMapping(name, mapping) {
  throw makeError('baobab-react/higher-order.branch: given cursors mapping is invalid (check the "' + name + '" component).', { mapping: mapping });
}

/**
 * Root component
 */
function root(tree, Component) {
  if (!(0, _helpers.isBaobabTree)(tree)) throw makeError('baobab-react/higher-order.root: given tree is not a Baobab.', { target: tree });

  if (typeof Component !== 'function') throw Error('baobab-react/higher-order.root: given target is not a valid React component.');

  var name = displayName(Component);

  var value = { tree: tree };

  var ComposedComponent = function (_React$Component) {
    _inherits(ComposedComponent, _React$Component);

    function ComposedComponent() {
      _classCallCheck(this, ComposedComponent);

      return _possibleConstructorReturn(this, (ComposedComponent.__proto__ || Object.getPrototypeOf(ComposedComponent)).apply(this, arguments));
    }

    _createClass(ComposedComponent, [{
      key: 'render',

      // Render shim
      value: function render() {
        return _react2.default.createElement(
          _context2.default.Provider,
          { value: value },
          _react2.default.createElement(Component, this.props)
        );
      }
    }]);

    return ComposedComponent;
  }(_react2.default.Component);

  ComposedComponent.displayName = 'Rooted' + name;

  return ComposedComponent;
}

/**
 * Branch component
 */
function branch(cursors, Component) {
  if (typeof Component !== 'function') throw Error('baobab-react/higher-order.branch: given target is not a valid React component.');

  var name = displayName(Component);

  if (!isPlainObject(cursors) && typeof cursors !== 'function') invalidMapping(name, cursors);

  var ComposedComponent = function (_React$Component2) {
    _inherits(ComposedComponent, _React$Component2);

    // Building initial state
    function ComposedComponent(props, context) {
      _classCallCheck(this, ComposedComponent);

      // Creating dispatcher
      var _this2 = _possibleConstructorReturn(this, (ComposedComponent.__proto__ || Object.getPrototypeOf(ComposedComponent)).call(this, props, context));

      _this2.dispatcher = function (fn) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return fn.apply(undefined, [_this2.context.tree].concat(args));
      };

      if (!cursors) return _possibleConstructorReturn(_this2);

      var mapping = (0, _helpers.solveMapping)(cursors, props, context);

      if (!mapping) invalidMapping(name, mapping);

      if (!_this2.context || !(0, _helpers.isBaobabTree)(_this2.context.tree)) throw makeError('baobab-react/higher-order.branch: tree is not available.');

      // Creating the watcher
      var watcher = _this2.context.tree.watch(mapping);

      var handler = function handler() {
        _this2.setState({ derived: _this2.state.watcher.get() });
      };

      watcher.on('update', handler);

      // Hydrating initial state
      _this2.state = {
        watcher: watcher,
        tree: context.tree,
        derived: watcher.get()
      };
      return _this2;
    }

    _createClass(ComposedComponent, [{
      key: 'render',


      // Render shim
      value: function render() {
        var _props = this.props,
            decoratedComponentRef = _props.decoratedComponentRef,
            props = _objectWithoutProperties(_props, ['decoratedComponentRef']);

        var suppl = { dispatch: this.dispatcher };

        return _react2.default.createElement(Component, _extends({}, props, suppl, this.state.derived, { ref: decoratedComponentRef }));
      }

      // On component unmount

    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (!this.state.watcher) return;

        // Releasing watcher
        this.state.watcher.release();
      }
    }], [{
      key: 'getDerivedStateFromProps',
      value: function getDerivedStateFromProps(props, _ref) {
        var watcher = _ref.watcher,
            tree = _ref.tree,
            mapping = _ref.mapping;

        if (!cursors) return;

        var newMapping = (0, _helpers.solveMapping)(cursors, props, { tree: tree });

        if (!newMapping) invalidMapping(name, newMapping);

        if ((0, _deepEqual2.default)(mapping, newMapping)) return;

        // Refreshing the watcher
        watcher.refresh(newMapping);
        return { mapping: mapping, derived: watcher.get() };
      }
    }]);

    return ComposedComponent;
  }(_react2.default.Component);

  ComposedComponent.displayName = 'Branched' + name;

  ComposedComponent.contextType = _context2.default;

  return ComposedComponent;
}

// Currying the functions so that they could be used as decorators
var curriedRoot = (0, _helpers.curry)(root, 2),
    curriedBranch = (0, _helpers.curry)(branch, 2);

exports.root = curriedRoot;
exports.branch = curriedBranch;