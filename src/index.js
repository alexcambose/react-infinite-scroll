import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import { isotrue } from './utils';

const propTypes = {
  loadMore: (props, propName, componentName) => {
    const hasAuto = props['auto'] && props['auto']['loadMore'];
    if (props[propName] && hasAuto) {
      return new Error(
        `${componentName} can't have two 'loadMore' props. Please delete the 'loadMore' that is outside the 'auto'!`
      );
    }
    if (!hasAuto && (!props[propName] || typeof props[propName] !== 'function'))
      return new Error(`${componentName} must have a 'loadMore' function!`);
  },
  hasMore: (props, propName, componentName) => {
    if (!props['auto'] && typeof props[propName] !== 'boolean')
      throw new Error(`${componentName}: hasMore must be set!`);
  },
  children: PropTypes.node,
  initialLoad: PropTypes.bool,
  offset: PropTypes.number,
  scrollableElement: PropTypes.any,
  throttle: PropTypes.number,
  getScrollTop: PropTypes.func,
  style: PropTypes.object,
  isLoading: PropTypes.bool,
  loading: PropTypes.node,
  noMore: PropTypes.node,
  auto: PropTypes.shape({
    loadMore: PropTypes.func.isRequired,
    perLoad: PropTypes.number.isRequired, // alias for limit
    onLoadMore: PropTypes.func.isRequired,
    useCount: PropTypes.bool,
    count: PropTypes.func,
    onCount: PropTypes.func,
    onCountError: PropTypes.func,
    onLoadMoreError: PropTypes.func,
    initialSkip: PropTypes.number,
  }),
};

const defaultProps = {
  offset: 300,
  scrollableElement: window,
  throttle: 240,
  initialLoad: true,
  loading: 'Loading...',
  noMore: 'No more items.',
};

class ReactInfiniteScroll extends Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  state = {
    // keeps track if the user has scrolled past the point that will trigger loadmore, if user is above this point triggeredLoad is false
    triggeredLoad: false,
    // how many times loadMore has been triggered
    page: 0,
    //auto mode state from props
    auto: {
      skip: (this.props.auto && this.props.auto.initialSkip) || 0,
      loading: false,
      hasMore: true,
      totalCount: 0,
    },
  };
  innerContainer = React.createRef();
  componentDidUpdate(prevProps) {
    // if the current loading prop is false and previous is true, check again
    // to see if the content is still before the end, maybe it wasn't big enough to fill the user's screen
    if (this.props.isLoading === false && prevProps.isLoading === true) {
      this.setState({ triggeredLoad: false }, this.scrollCheck);
    }
    // if (this.props.children.length !== prevProps.children.length)
    //   this.setState({ triggeredLoad: false }, this.scrollCheck);
  }
  componentDidMount = () => {
    const { scrollableElement, initialLoad, auto } = this.props;
    if (!scrollableElement) {
      throw new Error(
        `'scrollableElement' is not defined or the current value is not a dom element!`
      );
    }
    if (scrollableElement && scrollableElement.hasOwnProperty('current')) {
      throw new Error(
        `React ref detected! Please set 'scrollableElement' to it's 'current' value.`
      );
    }

    scrollableElement.addEventListener('scroll', this.handleScroll);
    // triggerLoad should be called at mounting only when using standard load more functionality,
    // if auto, triggerLoad will be called after counting elements
    if (initialLoad && !isotrue(auto)) this.triggerLoad();

    // if in auto mode but useCount is set to treu wich means that we need to create a first request that fetches initial data
    if (isotrue(auto) && !auto.useCount) this.triggerLoad();
    // if in auto mode and useCount is set to true we need at the first the total number of items
    if (isotrue(auto) && auto.useCount) {
      this.setState({
        auto: { ...this.state.auto, loading: true },
      });
      if (auto.count) {
        // if count is defined use it
        auto
          .count()
          .then(res => {
            // call optional callback
            if (auto.onCount) auto.onCount(res);
            // count method should return the total number of items as a simple number
            if (typeof res !== 'number')
              throw new Error(
                `Count method on the auto object does not return a number!`
              );
            this.setState(
              {
                // set the totalCount state
                // also set loading to false after counting is done
                auto: { ...this.state.auto, totalCount: res, loading: false },
              },
              this.triggerLoad
            ); // trigger load after counting is done
          })
          .catch(e => {
            // call optional callback
            if (auto.onCountError) onCountError(e);
          });
      } else {
        // if no count is defined use the required loadMore method but passing it 0 0 as the skip and limit
        auto
          .loadMore(0, 0)
          .then(res => {
            // at this point you may think: yooo, maybe we should call onLoadMore !
            // and I will tell yooou: NO, we shouldn't call that callback because this is just a loadMore
            // call that is used internally to set the totalCount(used internally), it's not something that the user will be aware of

            // a number is not required but something that can be counted, should be an array
            if (!Array.isArray(res))
              throw new Error(
                `LoadMore method on the 'auto' prop does not return an array!`
              );
            this.setState(
              {
                auto: {
                  ...this.state.auto,
                  // we hope it's a variable that has the lenght property, ideally an array
                  totalCount: res.length,
                  // also set loading to false after counting is done
                  loading: false,
                },
              },
              this.triggerLoad // trigger load after counting is done
            );
          })
          .catch(e => {
            // call optional callback ? ..yes
            if (auto.onLoadMoreError) onLoadMoreError(e);
          });
      }
    }
  };

  componentWillUnmount = () => {
    const { scrollableElement } = this.props;
    scrollableElement.removeEventListener('scroll', this.handleScroll);
  };

  getScrollTop = () => {
    const { scrollableElement, getScrollTop } = this.props;
    // if there is a user defined function to handle this use it first
    if (getScrollTop) return getScrollTop(scrollableElement);
    // if the specified element is not window, use a different property
    if (scrollableElement !== window) return scrollableElement.scrollTop;
    // going to defaults, the window
    return scrollableElement.scrollY;
  };

  getElementHeight = () => {
    const { scrollableElement, getElementHeight } = this.props;
    // if there is a user defined function to handle this use it first
    if (getElementHeight) getElementHeight(scrollableElement);
    // if the specified element is not window, use a different property
    if (scrollableElement === window) return scrollableElement.innerHeight;
    // going to defaults, the window
    else return scrollableElement.offsetHeight;
  };

  triggerLoad = () => {
    const autoState = this.state.auto;
    const autoProps = this.props.auto;
    const { loadMore, hasMore } = this.props;
    const { triggeredLoad, page } = this.state;
    // has two sections, if auto mod is set to true or the standard version
    if (isotrue(autoProps)) {
      // check not to (over)load
      if (triggeredLoad || !autoState.hasMore) return;

      const { loadMore, perLoad, onLoadMore, onCountError } = autoProps;
      const { skip } = autoState;

      // mark triggerLoad to true so that no requests will be made before this one
      this.setState({
        triggeredLoad: true,
        auto: { ...autoState, loading: true },
      });
      // call the required loadMore param
      const loadMoreResult = loadMore(skip, perLoad);
      // loadMore *MUST* return a promise (or be an async function)
      if (!loadMoreResult.then)
        throw new Error(
          `'loadMore' function must return a promise (or be an async function)`
        );
      loadMoreResult
        .then(res => {
          // callback
          onLoadMore(res);

          this.setState(
            {
              ...this.state,
              triggeredLoad: false, // can make new requests if needed
              auto: {
                ...autoState,
                skip: skip + perLoad, // increment skip with the amount of items should be loaded
                loading: false, // done loading
                // hasMore has two modes, if we use the count method we need to
                hasMore: autoProps.useCount
                  ? skip + perLoad < autoState.totalCount
                  : res.length === autoProps.perLoad,
              },
            },
            this.scrollCheck
          );
        })
        .catch(err => {
          if (onCountError) onCountError(err);
          this.setState({
            triggeredLoad: false,
            auto: { ...autoState, loading: true },
          });
        });
    } else {
      // normla mode
      // check not to (over)load
      if (triggeredLoad || !hasMore) return;
      // call required loadMore param
      loadMore(() => {
        // optional callback that can be called by the user after loading is done
        this.setState({ triggeredLoad: false }, this.scrollCheck);
      });
      // increment page and block new requests, we don't need to handle any sort of loading, it's user's business to do this
      this.setState({ triggeredLoad: true, page: page + 1 });
    }
  };
  handleScroll = throttle(() => this.scrollCheck(), this.props.throttle);
  scrollCheck = () => {
    const { offset, isLoading } = this.props;
    const { auto } = this.state;
    const windowBottom = this.getElementHeight() + this.getScrollTop();
    const infScrollBottom =
      this.innerContainer.current.offsetTop +
      this.innerContainer.current.offsetHeight;

    if (windowBottom >= infScrollBottom - offset) {
      // if it's over this breakpoint trigger a load
      this.triggerLoad();
    } else if (windowBottom < infScrollBottom) {
      // if the user is above the breakpoint set triggeredLoad to false only if the loading is done or it's not set
      if (
        (isLoading === false && auto.loading === false) ||
        typeof isLoading !== 'boolean'
      )
        this.setState({ triggeredLoad: false });
    }
  };
  render() {
    const { children, style, isLoading, loading, hasMore, noMore } = this.props;
    const autoProp = this.props.auto;
    const { auto } = this.state;
    return (
      <div style={style} ref={this.innerContainer}>
        {children}
        {(isLoading || auto.loading) && loading}
        {((!hasMore && !isotrue(autoProp)) ||
          (!auto.hasMore && isotrue(autoProp))) &&
          noMore}
      </div>
    );
  }
}
export default ReactInfiniteScroll;
