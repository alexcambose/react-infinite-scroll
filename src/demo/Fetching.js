import React, { Component } from 'react';
import InfiniteScroll from '@alexcambose/react-infinite-scroll';
import Loading from './components/Loading';
import NoMore from './components/NoMore';

class Basic extends Component {
  state = {
    users: [],
    usersCount: 0,
    skip: 0,
    limit: 6,
    loading: false,
  };

  componentDidMount = () => this.count();

  count = () => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.json())
      .then((res) => {
        this.setState({ usersCount: res.length });
      });
  };

  loadMore = () => {
    const { skip, limit } = this.state;
    this.setState({ loading: true });
    fetch(`https://jsonplaceholder.typicode.com/posts?_start=${skip}&_limit=${limit}`)
      .then(res => res.json())
      .then((res) => {
        this.setState(({ users }) => ({
          users: [...users, ...res],
          skip: skip + limit,
          loading: false,
        }));
      });
  };

  render() {
    const {
      users, skip, usersCount, loading,
    } = this.state;
    return (
        <div>
            <p>A classic example.</p>
            {/* We need to check if usersCount is fetched, for this example we will check if it's 0 */}
            <InfiniteScroll
                isLoading={loading}
                loading={<Loading />}
                loadMore={this.loadMore}
                hasMore={usersCount === 0 || skip < usersCount}
                noMore={<NoMore />}
            >
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
