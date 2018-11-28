# react-infinite-scroll

[![Build Status](https://travis-ci.org/alexcambose/react-infinite-scroll.svg?branch=master)](https://travis-ci.org/alexcambose/react-infinite-scroll)

Another react infinite scroll package

[Demo and more docs](https://alexcambose.github.io/react-infinite-scroll)

# Installation

[npm](https://www.npmjs.com/package/@alexcambose/react-infinite-scroll) package

```
npm i -S @alexcambose/react-infinite-scroll
```

```js
const InfiniteScroll = require('@alexcambose/react-infinite-scroll');
// or
import InfiniteScroll from '@alexcambose/react-infinite-scroll';
```

## Usage

Basic example

```js
class Basic extends Component {
  state = {
    items: [],
    skip: 0,
    perLoad: 10,
    hasMore: true,
  };

  loadMore = () => {
    const { items, skip, perLoad } = this.state;
    fetch(
      `https://jsonplaceholder.typicode.com/posts?_start=${skip}&_limit=${perLoad}`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({
          items: [...items, ...res],
          skip: skip + perLoad,
          hasMore: res.length >= perLoad,
        });
      });
  };

  render() {
    const { items, hasMore } = this.state;
    return (
      <InifiniteScroll hasMore={hasMore} loadMore={this.loadMore}>
        {items.map((e, i) => (
          <div key={i}>{e.title}</div>
        ))}
      </InifiniteScroll>
    );
  }
}
```

## Props

|   Property Name   | isRequired |            default             |          type          |                                                                                                                                                                                                        Description                                                                                                                                                                                                        |
| :---------------: | :--------: | :----------------------------: | :--------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|     loadMore      |    true    |               -                |          func          | A function that will be called after reaching the bottom. It should fetch data and append it to the current data object. Eg: [1,2,3] -> [1,2,3,4,5]. It receives in the first parameter a function that can be called after the fetching is done to check again if the user scroll is below the last piece of content to call the loadMore function again. Eg: `loadMore = callback => get('url').then(() => callback())` |
|    initialLoad    |   false    |              true              |          bool          |                                                                                                                                                                          If true it will call loadMore at the beginning, when componentDidMount.                                                                                                                                                                          |
|     isLoading     |   false    |             false              |          bool          |                                                                                                                                                                                               Toggles the loading animation                                                                                                                                                                                               |
|      loading      |   false    |          "Loading..."          |          node          |                                                                                                                                                                                   Loading animation. Can be any valid _react element_.                                                                                                                                                                                    |
|      hasMore      |    true    |               -                |          bool          |                                                                                                                                            If there are no more items(skip + limt >= totalCount) this prop should change to false so _loadMore_ is not called again and the `                                                                                                                                             |
|      noMore       |   false    |        "No more items."        |          node          |                                                                                                                                                                                     No more message. Can be any valid react element.                                                                                                                                                                                      |
|       auto        |   false    |               {}               |         object         |                                                                                                                                                                                  Enabled auto mode. See description [here](#auto-mode).                                                                                                                                                                                   |
|     throttle      |   false    |              100               |         number         |                                                                                                                                                               How many number of milliseconds need to pass so that the scroll handler will be executed once                                                                                                                                                               |
| scrollableElement |   false    |             window             | instanceof HTMLElement |                                                                                                                                                                       The HTML Element that will be used to get and calculate the scroll position.                                                                                                                                                                        |
|   getScrollTop    |   false    |   scrollableElement.scrollY    |        function        |                                                                                                                                         Overrides the default method of getting the element scroll top position. The single parameter is represented by the _scrollableElement_.                                                                                                                                          |
| getElementHeight  |   false    | scrollableElement.offsetHeight |        function        |                                                                                                                                                Overrides the default method of getting the element height. The single parameter is represented by the _scrollableElement_                                                                                                                                                 |

## Auto mode

Auto mode is a feature that lets you create infinite scrolling lists without worrying about handling skip or checking if there are items left to fetch.

Basic example

```js
class Basic extends Component {
  state = {
    items: [],
  };

  loadMore = (skip, perLoad) =>
    fetch(
      `https://jsonplaceholder.typicode.com/posts?_start=${skip}&_limit=${perLoad}`
    ).then(res => res.json());

  render() {
    const { items } = this.state;
    return (
      <InifiniteScroll
        auto={{
          loadMore: this.loadMore,
          perLoad: 10,
          onLoadMore: newItems =>
            this.setState({ items: [...items, ...newItems] }),
        }}
      >
        {items.map((e, i) => (
          <div key={i}>{e.title}</div>
        ))}
      </InifiniteScroll>
    );
  }
}
```

## Props for auto mode

|  Property Name  | isRequired | default |  type  |                                                                                                Description                                                                                                 |
| :-------------: | :--------: | :-----: | :----: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|    loadMore     |    true    |    -    |  func  |                                                 Function that will be called to fetch items. Takes two arguments: skip and perLoad. Must return a promise.                                                 |
|   onLoadMore    |    true    |    -    |  func  |                                                 Callback that will be called when loadMore is resolved. Take as an arguments the result from the loadMore.                                                 |
|     perLoad     |    true    |    -    | number |                                                              How many items to load at once. Will also be passed as an arguments to loadMore                                                               |
|    useCount     |   false    |  false  |  bool  |                                                If it's set to true, infinite scroll will calculate if it has more items based on the total number of items.                                                |
|      count      |   false    |    -    |  func  | The function that will be called to get the number of all items. Must return a number. If useCount is set to true and count prop is not specified it will use loadMore with the skip and perLoad set to 0. |
|     onCount     |   false    |    -    |  func  |                                                                      Called after count is resolved. Takes as an argument the items.                                                                       |
|  onCountError   |   false    |    -    |  func  |                                                                    Called if count is rejected. Takes as an argument the promise error.                                                                    |
| onLoadMoreError |   false    |    -    |  func  |                                                                  Called if loadMore is rejected. Takes as an argument the promise error.                                                                   |
|   initialSkip   |   false    |    0    | number |                                                                                 How many items to skip at the first load.                                                                                  |
