import React from 'react';
import { shallow } from 'enzyme';
import InfiniteScroll from '../src/index';

describe('main module', () => {
  let component;
  beforeEach(() => {
    component = shallow(<InfiniteScroll />);
  });
  it('props', () => {
    expect(true).toBeTruthy();
  });
});
