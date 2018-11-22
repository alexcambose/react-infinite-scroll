"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash.throttle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var propTypes = {
  offset: _propTypes.default.number,
  children: _propTypes.default.node,
  scrollableElement: _propTypes.default.object,
  throttle: _propTypes.default.number,
  getScrollTop: _propTypes.default.func
};
var defaultProps = {
  offset: 300,
  scrollableElement: window,
  throttle: 200
};

var ReactInfiniteScroll =
/*#__PURE__*/
function (_Component) {
  _inherits(ReactInfiniteScroll, _Component);

  function ReactInfiniteScroll() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ReactInfiniteScroll);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ReactInfiniteScroll)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "componentDidMount", function () {
      var scrollableElement = _this.props.scrollableElement;
      scrollableElement.addEventListener('scroll', _this.handleScroll);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "componentDidUnmount", function () {
      var scrollableElement = _this.props.scrollableElement;
      scrollableElement.removeEventListener('scroll', _this.handleScroll);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getScrollTop", function () {
      var _this$props = _this.props,
          scrollableElement = _this$props.scrollableElement,
          getScrollTop = _this$props.getScrollTop;
      if (getScrollTop) return getScrollTop(scrollableElement);
      if (scrollableElement !== window) return scrollableElement.scrollTop;
      return window.scrollY;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleScroll", (0, _lodash.default)(function (e) {
      console.log(document.body.clientHeight, _this.getScrollTop());
    }, _this.props.throttle));

    return _this;
  }

  _createClass(ReactInfiniteScroll, [{
    key: "render",
    value: function render() {
      var children = this.props.children;
      return _react.default.createElement("div", null, children);
    }
  }]);

  return ReactInfiniteScroll;
}(_react.Component);

_defineProperty(ReactInfiniteScroll, "propTypes", propTypes);

_defineProperty(ReactInfiniteScroll, "defaultProps", defaultProps);

var _default = ReactInfiniteScroll;
exports.default = _default;