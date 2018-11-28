import React from 'react';
import { mount } from 'enzyme';
import InfiniteScroll from '../src/index';
import { JSDOM } from 'jsdom';

const { window } = new JSDOM(`<!DOCTYPE html><div id="el">content</div>`);
const el = window.document.getElementById('el');

const loadMore = () => {};

describe('main module', () => {
  let component;
  beforeEach(() => {
    component = mount(<InfiniteScroll loadMore={loadMore} hasMore={true} />);
  });
  it('default scrollable element should be `window`', () => {
    expect(JSON.stringify(component.props('scrollableElement').alert)).toEqual(
      JSON.stringify(window.alert)
    );
  });
  it('contains a div element', () => {
    expect(component.contains(<div />)).toBeTruthy();
  });
  it('default scrollable element should be `window`', () => {
    expect(JSON.stringify(component.props('scrollableElement').alert)).toEqual(
      JSON.stringify(window.alert)
    );
  });
  it('adapts to a custom scollElement', () => {
    const newComponent = mount(
      <InfiniteScroll
        loadMore={loadMore}
        scrollableElement={el}
        hasMore={true}
      />
    );
    expect(newComponent.instance().getElementHeight()).toEqual(0);
  });
});
