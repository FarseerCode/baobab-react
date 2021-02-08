'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.branch = exports.root = undefined;

var _propTypes = require('./utils/prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _helpers = require('./utils/helpers');

var _baobab = require('baobab');

var _baobab2 = _interopRequireDefault(_baobab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeError = _baobab2.default.helpers.makeError;

/**
 * Helpers
 */
/**
 * Baobab-React Mixins
 * ====================
 *
 * Old style react mixins.
 */
function displayName(instance) {
  return (instance.constructor || {}).displayName || 'Component';
}

/**
 * Root mixin
 */
var RootMixin = {

  // Component prop types
  propTypes: {
    tree: _propTypes2.default.baobab
  },

  // Context prop types
  childContextTypes: {
    tree: _propTypes2.default.baobab
  },

  // Handling child context
  getChildContext: function getChildContext() {
    return {
      tree: this.props.tree
    };
  }
};

/**
 * Branch mixin
 */
var BranchMixin = {

  // Retrieving the tree from context
  contextTypes: {
    tree: _propTypes2.default.baobab
  },

  // Building initial state
  getInitialState: function getInitialState() {
    var name = displayName(this);

    if (this.cursors) {
      this.__cursorsMapping = this.cursors;

      var mapping = (0, _helpers.solveMapping)(this.__cursorsMapping, this.props, this.context);

      // If the solved mapping is not valid, we throw
      if (!mapping) throw makeError('baobab-react/mixins.branch: given mapping is invalid (check the "' + name + '" component).', { mapping: mapping });

      // Creating the watcher
      this.__watcher = this.context.tree.watch(mapping);

      // Building initial state
      return this.__watcher.get();
    }

    return null;
  },


  // On component mount
  componentWillMount: function componentWillMount() {
    var _this = this;

    // Creating dispatcher
    this.dispatch = function (fn) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return fn.apply(undefined, [_this.context.tree].concat(args));
    };

    if (!this.__watcher) return;

    var handler = function handler() {
      if (_this.__watcher) _this.setState(_this.__watcher.get());
    };

    this.__watcher.on('update', handler);
  },


  // On component unmount
  componentWillUnmount: function componentWillUnmount() {
    if (!this.__watcher) return;

    // Releasing facet
    this.__watcher.release();
    this.__watcher = null;
  },


  // On new props
  componentWillReceiveProps: function componentWillReceiveProps(props) {
    if (!this.__watcher || typeof this.__cursorsMapping !== 'function') return;

    var name = displayName(this);

    // Refreshing the watcher
    var mapping = (0, _helpers.solveMapping)(this.__cursorsMapping, props, this.context);

    if (!mapping) throw makeError('baobab-react/mixins.branch: given mapping is invalid (check the "' + name + '" component).', { mapping: mapping });

    this.__watcher.refresh(mapping);
    this.setState(this.__watcher.get());
  }
};

exports.root = RootMixin;
exports.branch = BranchMixin;