import React, { Component } from 'react';
import Remarkable from 'remarkable';
import Loading from './demo/components/Loading';

const md = new Remarkable();
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docsMd: '',
      loading: true,
    };
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/alexcambose/react-infinite-scroll/master/README.md')
      .then(e => e.text())
      .then((e) => {
        this.setState({ docsMd: e, loading: false });
      });
  }

  render() {
    const { docsMd, loading } = this.state;
    if (loading) return <Loading />;
    return <div dangerouslySetInnerHTML={{ __html: md.render(docsMd) }} />;
  }
}

export default App;
