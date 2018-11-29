import React, { Component } from 'react';
import InfiniteScroll from '@alexcambose/react-infinite-scroll';

class Basic extends Component {
  state = {
    users: [],
  };

  loadMore = async (skip, limit) => {
    let res = await fetch(
      `https://jsonplaceholder.typicode.com/users?${skip ? `_start=${skip}` : ''}&${
        limit ? `_limit=${limit}` : ''
      }`,
    );
    res = await res.json();
    return res;
  };

  onLoaded = (data) => {
    this.setState(({ users }) => ({
      users: [...users, ...data],
    }));
  };

  render() {
    const { users } = this.state;
    return (
        <div>
            <p>An example using "auto" mode.</p>
            <InfiniteScroll auto={{ loadMore: this.loadMore, perLoad: 3, onLoadMore: this.onLoaded }}>
                {users.map((e, i) => (
                    <div key={i} className="card-large">
                        {JSON.stringify(e)}
                    </div>
          ))}
            </InfiniteScroll>
        </div>
    );
  }
}

export default Basic;
