import React, { Component } from 'react';
import DemoNavbar from './NavbarDemo';

class Demo extends Component {
  render() {
    const { children } = this.props;
    return (
        <div>
            <DemoNavbar />
            {children}
        </div>
    );
  }
}

export default Demo;
