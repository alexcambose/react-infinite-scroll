"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash.throttle"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

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
  loadMore: function loadMore(props, propName, componentName) {
    var hasAuto = props['auto'] && props['auto']['loadMore'];

    if (props[propName] && hasAuto) {
      return new Error("".concat(componentName, " can't have two 'loadMore' props. Please delete the 'loadMore' that is outside the 'auto'!"));
    }

    if (!hasAuto && (!props[propName] || typeof props[propName] !== 'function')) return new Error("".concat(componentName, " must have a 'loadMore' function!"));
  },
  hasMore: function hasMore(props, propName, componentName) {
    if (!props['auto'] && typeof props[propName] !== 'boolean') throw new Error("".concat(componentName, ": hasMore must be set!"));
  },
  children: _propTypes.default.node,
  initialLoad: _propTypes.default.bool,
  offset: _propTypes.default.number,
  scrollableElement: _propTypes.default.any,
  throttle: _propTypes.default.number,
  getScrollTop: _propTypes.default.func,
  style: _propTypes.default.object,
  isLoading: _propTypes.default.bool,
  loading: _propTypes.default.node,
  noMore: _propTypes.default.node,
  auto: _propTypes.default.shape({
    loadMore: _propTypes.default.func.isRequired,
    perLoad: _propTypes.default.number.isRequired,
    // alias for limit
    onLoadMore: _propTypes.default.func.isRequired,
    useCount: _propTypes.default.bool,
    count: _propTypes.default.func,
    onCount: _propTypes.default.func,
    onCountError: _propTypes.default.func,
    onLoadMoreError: _propTypes.default.func,
    initialSkip: _propTypes.default.number
  })
};
var defaultProps = {
  offset: 300,
  scrollableElement: window,
  throttle: 240,
  initialLoad: true,
  loading: 'Loading...',
  noMore: 'No more items.'
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

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      // keeps track if the user has scrolled past the point that will trigger loadmore, if user is above this point triggeredLoad is false
      triggeredLoad: false,
      // how many times loadMore has been triggered
      page: 0,
      //auto mode state from props
      auto: {
        skip: _this.props.auto && _this.props.auto.initialSkip || 0,
        loading: false,
        hasMore: true,
        totalCount: 0
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "innerContainer", _react.default.createRef());

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "componentDidMount", function () {
      var _this$props = _this.props,
          scrollableElement = _this$props.scrollableElement,
          initialLoad = _this$props.initialLoad,
          auto = _this$props.auto;

      if (!scrollableElement) {
        throw new Error("'scrollableElement' is not defined or the current value is not a dom element!");
      }

      if (scrollableElement && scrollableElement.hasOwnProperty('current')) {
        throw new Error("React ref detected! Please set 'scrollableElement' to it's 'current' value.");
      }

      scrollableElement.addEventListener('scroll', _this.handleScroll); // triggerLoad should be called at mounting only when using standard load more functionality,
      // if auto, triggerLoad will be called after counting elements

      if (initialLoad && !(0, _utils.isotrue)(auto)) _this.triggerLoad(); // if in auto mode but useCount is set to treu wich means that we need to create a first request that fetches initial data

      if ((0, _utils.isotrue)(auto) && !auto.useCount) _this.triggerLoad(); // if in auto mode and useCount is set to true we need at the first the total number of items

      if ((0, _utils.isotrue)(auto) && auto.useCount) {
        _this.setState({
          auto: _objectSpread({}, _this.state.auto, {
            loading: true
          })
        });

        if (auto.count) {
          // if count is defined use it
          auto.count().then(function (res) {
            // call optional callback
            if (auto.onCount) auto.onCount(res); // count method should return the total number of items as a simple number

            if (typeof res !== 'number') throw new Error("Count method on the auto object does not return a number!");

            _this.setState({
              // set the totalCount state
              // also set loading to false after counting is done
              auto: _objectSpread({}, _this.state.auto, {
                totalCount: res,
                loading: false
              })
            }, _this.triggerLoad); // trigger load after counting is done

          }).catch(function (e) {
            // call optional callback
            if (auto.onCountError) onCountError(e);
          });
        } else {
          // if no count is defined use the required loadMore method but passing it 0 0 as the skip and limit
          auto.loadMore(0, 0).then(function (res) {
            // at this point you may think: yooo, maybe we should call onLoadMore !
            // and I will tell yooou: NO, we shouldn't call that callback because this is just a loadMore
            // call that is used internally to set the totalCount(used internally), it's not something that the user will be aware of
            // a number is not required but something that can be counted, should be an array
            if (!Array.isArray(res)) throw new Error("LoadMore method on the 'auto' prop does not return an array!");

            _this.setState({
              auto: _objectSpread({}, _this.state.auto, {
                // we hope it's a variable that has the lenght property, ideally an array
                totalCount: res.length,
                // also set loading to false after counting is done
                loading: false
              })
            }, _this.triggerLoad // trigger load after counting is done
            );
          }).catch(function (e) {
            // call optional callback ? ..yes
            if (auto.onLoadMoreError) onLoadMoreError(e);
          });
        }
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "componentWillUnmount", function () {
      var scrollableElement = _this.props.scrollableElement;
      scrollableElement.removeEventListener('scroll', _this.handleScroll);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getScrollTop", function () {
      var _this$props2 = _this.props,
          scrollableElement = _this$props2.scrollableElement,
          getScrollTop = _this$props2.getScrollTop; // if there is a user defined function to handle this use it first

      if (getScrollTop) return getScrollTop(scrollableElement); // if the specified element is not window, use a different property

      if (scrollableElement !== window) return scrollableElement.scrollTop; // going to defaults, the window

      return scrollableElement.scrollY;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getElementHeight", function () {
      var _this$props3 = _this.props,
          scrollableElement = _this$props3.scrollableElement,
          getElementHeight = _this$props3.getElementHeight; // if there is a user defined function to handle this use it first

      if (getElementHeight) getElementHeight(scrollableElement); // if the specified element is not window, use a different property

      if (scrollableElement === window) return scrollableElement.innerHeight; // going to defaults, the window
      else return scrollableElement.offsetHeight;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "triggerLoad", function () {
      var autoState = _this.state.auto;
      var autoProps = _this.props.auto;
      var _this$props4 = _this.props,
          loadMore = _this$props4.loadMore,
          hasMore = _this$props4.hasMore;
      var _this$state = _this.state,
          triggeredLoad = _this$state.triggeredLoad,
          page = _this$state.page; // has two sections, if auto mod is set to true or the standard version

      if ((0, _utils.isotrue)(autoProps)) {
        // check not to (over)load
        if (triggeredLoad || !autoState.hasMore) return;
        var _loadMore = autoProps.loadMore,
            perLoad = autoProps.perLoad,
            onLoadMore = autoProps.onLoadMore,
            _onCountError = autoProps.onCountError;
        var skip = autoState.skip; // mark triggerLoad to true so that no requests will be made before this one

        _this.setState({
          triggeredLoad: true,
          auto: _objectSpread({}, autoState, {
            loading: true
          })
        }); // call the required loadMore param


        var loadMoreResult = _loadMore(skip, perLoad); // loadMore *MUST* return a promise (or be an async function)


        if (!loadMoreResult.then) throw new Error("'loadMore' function must return a promise (or be an async function)");
        loadMoreResult.then(function (res) {
          // callback
          onLoadMore(res);

          _this.setState(_objectSpread({}, _this.state, {
            triggeredLoad: false,
            // can make new requests if needed
            auto: _objectSpread({}, autoState, {
              skip: skip + perLoad,
              // increment skip with the amount of items should be loaded
              loading: false,
              // done loading
              // hasMore has two modes, if we use the count method we need to
              hasMore: autoProps.useCount ? skip + perLoad < autoState.totalCount : res.length === autoProps.perLoad
            })
          }), _this.scrollCheck);
        }).catch(function (err) {
          if (_onCountError) _onCountError(err);

          _this.setState({
            triggeredLoad: false,
            auto: _objectSpread({}, autoState, {
              loading: true
            })
          });
        });
      } else {
        // normla mode
        // check not to (over)load
        if (triggeredLoad || !hasMore) return; // call required loadMore param

        loadMore(function () {
          // optional callback that can be called by the user after loading is done
          _this.setState({
            triggeredLoad: false
          }, _this.scrollCheck);
        }); // increment page and block new requests, we don't need to handle any sort of loading, it's user's business to do this

        _this.setState({
          triggeredLoad: true,
          page: page + 1
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleScroll", (0, _lodash.default)(function () {
      return _this.scrollCheck();
    }, _this.props.throttle));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "scrollCheck", function () {
      var _this$props5 = _this.props,
          offset = _this$props5.offset,
          isLoading = _this$props5.isLoading;
      var auto = _this.state.auto;

      var windowBottom = _this.getElementHeight() + _this.getScrollTop();

      var infScrollBottom = _this.innerContainer.current.offsetTop + _this.innerContainer.current.offsetHeight;

      if (windowBottom >= infScrollBottom - offset) {
        // if it's over this breakpoint trigger a load
        _this.triggerLoad();
      } else if (windowBottom < infScrollBottom) {
        // if the user is above the breakpoint set triggeredLoad to false only if the loading is done or it's not set
        if (isLoading === false && auto.loading === false || typeof isLoading !== 'boolean') _this.setState({
          triggeredLoad: false
        });
      }
    });

    return _this;
  }

  _createClass(ReactInfiniteScroll, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      // if the current loading prop is false and previous is true, check again
      // to see if the content is still before the end, maybe it wasn't big enough to fill the user's screen
      if (this.props.isLoading === false && prevProps.isLoading === true) {
        this.setState({
          triggeredLoad: false
        }, this.scrollCheck);
      } // if (this.props.children.length !== prevProps.children.length)
      //   this.setState({ triggeredLoad: false }, this.scrollCheck);

    }
  }, {
    key: "render",
    value: function render() {
      var _this$props6 = this.props,
          children = _this$props6.children,
          style = _this$props6.style,
          isLoading = _this$props6.isLoading,
          loading = _this$props6.loading,
          hasMore = _this$props6.hasMore,
          noMore = _this$props6.noMore;
      var autoProp = this.props.auto;
      var auto = this.state.auto;
      return _react.default.createElement("div", {
        style: style,
        ref: this.innerContainer
      }, children, (isLoading || auto.loading) && loading, (!hasMore && !(0, _utils.isotrue)(autoProp) || !auto.hasMore && (0, _utils.isotrue)(autoProp)) && noMore);
    }
  }]);

  return ReactInfiniteScroll;
}(_react.Component);

_defineProperty(ReactInfiniteScroll, "propTypes", propTypes);

_defineProperty(ReactInfiniteScroll, "defaultProps", defaultProps);

var _default = ReactInfiniteScroll;
exports.default = _default;