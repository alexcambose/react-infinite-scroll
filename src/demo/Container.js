import React, { Component } from 'react';
import InfiniteScroll from '@alexcambose/react-infinite-scroll';
import Loading from './components/Loading';
import NoMore from './components/NoMore';

class Basic extends Component {
  state = {
    users2: [],
    users1: [],
    usersCount1: 0,
    skip1: 0,
    limit1: 6,
    loading1: false,
    usersCount2: 0,
    skip2: 0,
    limit2: 6,
    loading2: false,
  };

  box1 = React.createRef();

  box2 = React.createRef();

  componentDidMount = () => this.count1();

  count1 = () => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.json())
      .then((res) => {
        this.setState({ usersCount1: res.length });
      });
  };

  loadMore1 = () => {
    const { skip1, limit1 } = this.state;
    this.setState({ loading1: true });
    fetch(`https://jsonplaceholder.typicode.com/posts?_start=${skip1}&_limit=${limit1}`)
      .then(res => res.json())
      .then((res) => {
        this.setState(({ users1 }) => ({
          users1: [...users1, ...res],
          skip1: skip1 + limit1,
          loading1: false,
        }));
      });
  };

  count2 = () => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.json())
      .then((res) => {
        this.setState({ usersCount2: res.length });
      });
  };

  loadMore2 = () => {
    const { skip2, limit2 } = this.state;
    this.setState({ loading2: true });
    fetch(`https://jsonplaceholder.typicode.com/posts?_start=${skip2}&_limit=${limit2}`)
      .then(res => res.json())
      .then((res) => {
        this.setState(({ users2 }) => ({
          users2: [...users2, ...res],
          skip2: skip2 + limit2,
          loading2: false,
        }));
      });
  };

  render() {
    const {
      users1,
      skip1,
      usersCount1,
      loading1,
      users2,
      skip2,
      usersCount2,
      loading2,
    } = this.state;
    return (
        <div>
            <p>An example using multiple components bounded to different containers</p>
            <div className="row">
                <div className="six columns">
                    <div ref={this.box1} className="box">
                        {this.box1.current && (
                        <InfiniteScroll
                            isLoading={loading1}
                            loading={<Loading />}
                            scrollableElement={this.box1.current}
                            loadMore={this.loadMore1}
                            hasMore={usersCount1 === 0 || skip1 < usersCount1}
                            noMore={<NoMore />}
                        >
                            {users1.map((e, i) => (
                                <div key={i} className="card-large">
                                    {JSON.stringify(e)}
                                </div>
                  ))}
                        </InfiniteScroll>
              )}
                    </div>
                </div>
                <div className="six columns">
                    <div ref={this.box2} className="box">
                        {this.box2.current && (
                        <InfiniteScroll
                            isLoading={loading2}
                            loading={<Loading />}
                            scrollableElement={this.box2.current}
                            loadMore={this.loadMore2}
                            hasMore={usersCount2 === 0 || skip2 < usersCount2}
                            noMore={<NoMore />}
                        >
                            {users2.map((e, i) => (
                                <div key={i} className="card-large">
                                    {JSON.stringify(e)}
                                </div>
                  ))}
                        </InfiniteScroll>
              )}
                    </div>
                </div>
            </div>
            {/* <InfiniteScroll
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
            </InfiniteScroll> */}
        </div>
    );
  }
}

export default Basic;
