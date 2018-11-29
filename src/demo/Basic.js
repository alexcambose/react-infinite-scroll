import React, { Component } from 'react';
import InfiniteScroll from '@alexcambose/react-infinite-scroll';

class Basic extends Component {
  state = {
    // generate an array with 30 elements 0,1,2,3....29
    items: Array.from(Array(30).keys()),
    loading: false,
  };

  loadMore = () => {
    const { items } = this.state;
    this.setState({ loading: true });
    setTimeout(() => {
      const newItems = [];
      for (let i = 0; i < 10; i++) newItems.push(items[items.length - 1] + i);
      this.setState({ items: [...items, ...newItems] });
    }, 5000);
  };

  render() {
    const { items } = this.state;
    return (
        <div>
            <p>
          Dead simple example using the least amount of code in order to get it running. No loading
          animation, no nothing.
            </p>
            <InfiniteScroll hasMore={items.length < 70} loadMore={this.loadMore}>
                {items.map((e, i) => (
                    <div key={i} className="card-large">
                        {e}
                    </div>
          ))}
            </InfiniteScroll>
        </div>
    );
  }
}

export default Basic;
