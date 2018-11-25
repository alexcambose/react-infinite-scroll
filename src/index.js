import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';

const propTypes = {
  loadMore: (props, propName, componentName) => {
    const hasAuto = props['auto'] && props['auto']['loadMore'];
    if (props[propName] && hasAuto) {
      return new Error(
        `${componentName} can't have two 'loadMore' props. Please delete the 'loadMore' that is outside the 'auto'!`
      );
    }
    if (!hasAuto && (!props[propName] || typeof props[propName]))
      return new Error(`${componentName} must have a 'loadMore' function!`);
  },
  children: PropTypes.node,
  initialLoad: PropTypes.bool,
  offset: PropTypes.number,
  scrollableElement: PropTypes.any,
  throttle: PropTypes.number,
  getScrollTop: PropTypes.func,
  hasMore: PropTypes.bool,
  style: PropTypes.object,
  isLoading: PropTypes.bool,
  loading: PropTypes.node,
  noMore: PropTypes.node,
  auto: PropTypes.shape({
    loadMore: PropTypes.func.isRequired,
    perLoad: PropTypes.number.isRequired,
    onLoaded: PropTypes.func.isRequired,
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
  throttle: 200,
  hasMore: true,
  initialLoad: true,
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
    // if the current loadgin prop is false and previous is true, check again
    // to see if the content is still before the end, maybe it wasn't big enough to fill the user's screen
    if (this.props.isLoading === false && prevProps.isLoading === true)
      this.setState({ triggeredLoad: false }, this.scrollCheck);
  }
  componentDidMount = () => {
    const { scrollableElement, initialLoad, auto } = this.props;
    scrollableElement.addEventListener('scroll', this.handleScroll);
    if (initialLoad) this.triggerLoad();
    if (auto) {
      if (auto.count) {
        auto
          .count()
          .then(res => {
            if (auto.onCount) auto.onCount(res);
          })
          .catch(e => {
            if (auto.onCountError) onCountError(e);
          });
      } else {
        auto
          .loadMore(skip, auto.limit)
          .then(res => {
            if (auto.onLoadMore) auto.onLoadMore(res);
          })
          .catch(e => {
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
    if (getScrollTop) return getScrollTop(scrollableElement);
    if (scrollableElement !== window) return scrollableElement.scrollTop;
    return window.scrollY;
  };

  getElementHeight = () => {
    const { scrollableElement } = this.props;
    if (scrollableElement === window) return scrollableElement.innerHeight;
    else return scrollableElement.offsetHeight;
  };

  triggerLoad = () => {
    const { loadMore, hasMore, auto } = this.props;
    const { triggeredLoad, page } = this.state;
    if (triggeredLoad || !hasMore) return;
    loadMore(() => {
      this.setState({ triggeredLoad: false });
      this.scrollCheck();
    });
    this.setState({ triggeredLoad: true, page: page + 1 });
  };
  handleScroll = throttle(() => this.scrollCheck(), this.props.throttle);
  scrollCheck = () => {
    const { offset } = this.props;
    const windowBottom = this.getElementHeight() + this.getScrollTop();
    const infScrollBottom =
      this.innerContainer.current.offsetTop +
      this.innerContainer.current.offsetHeight;
    console.log(windowBottom, infScrollBottom - offset);

    if (windowBottom >= infScrollBottom - offset) {
      this.triggerLoad();
    } else if (windowBottom < infScrollBottom) {
      this.setState({ triggeredLoad: false });
    }
  };
  render() {
    const { children, style, isLoading, loading } = this.props;
    return (
      <div style={style} ref={this.innerContainer}>
        {children}
        {isLoading && loading}
      </div>
    );
  }
}
export default ReactInfiniteScroll;
