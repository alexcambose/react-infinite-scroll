import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';

const propTypes = {
  offset: PropTypes.number,
  children: PropTypes.node,
  scrollableElement: PropTypes.object,
  throttle: PropTypes.number,
  getScrollTop: PropTypes.func,
};

const defaultProps = {
  offset: 300,
  scrollableElement: window,
  throttle: 200,
};

class ReactInfiniteScroll extends Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  componentDidMount = () => {
    const { scrollableElement } = this.props;
    scrollableElement.addEventListener('scroll', this.handleScroll);
  };

  componentDidUnmount = () => {
    const { scrollableElement } = this.props;
    scrollableElement.removeEventListener('scroll', this.handleScroll);
  };

  getScrollTop = () => {
    const { scrollableElement, getScrollTop } = this.props;
    if (getScrollTop) return getScrollTop(scrollableElement);
    if (scrollableElement !== window) return scrollableElement.scrollTop;
    return window.scrollY;
  };

  handleScroll = throttle(e => {
    console.log(document.body.clientHeight, this.getScrollTop());
  }, this.props.throttle);

  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}
export default ReactInfiniteScroll;
