import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';

const propTypes = {
  loadMore: PropTypes.func.isRequired,
  offset: PropTypes.number,
  children: PropTypes.node,
  scrollableElement: PropTypes.any,
  throttle: PropTypes.number,
  getScrollTop: PropTypes.func,
  hasMore: PropTypes.bool,
  style: PropTypes.object,
};

const defaultProps = {
  offset: 300,
  scrollableElement: window,
  throttle: 200,
  hasMore: true,
};

class ReactInfiniteScroll extends Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  state = {
    triggeredLoad: false,
  };
  innerContainer = React.createRef();

  componentDidMount = () => {
    const { scrollableElement } = this.props;
    scrollableElement.addEventListener('scroll', this.handleScroll);
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
    const { loadMore, hasMore } = this.props;
    const { triggeredLoad } = this.state;
    if (triggeredLoad || !hasMore) return;
    loadMore(() => {
      this.setState({ triggeredLoad: false });
      this.scrollCheck();
    });
    this.setState({ triggeredLoad: true });
  };
  handleScroll = throttle(() => this.scrollCheck(), this.props.throttle);
  scrollCheck = () => {
    if (
      this.getElementHeight() + this.getScrollTop() >=
      this.innerContainer.current.offsetHeight
    ) {
      this.triggerLoad();
    } else {
      this.setState({ triggeredLoad: false });
    }
  };
  render() {
    const { children, style } = this.props;
    return (
      <div style={style} ref={this.innerContainer}>
        {children}
      </div>
    );
  }
}
export default ReactInfiniteScroll;
