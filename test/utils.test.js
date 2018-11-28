import { isotrue } from '../src/utils';

describe('utils', () => {
  it('isotrue', () => {
    expect(isotrue({})).toBeFalsy();
    expect(isotrue({ a: 1 })).toBeTruthy();
  });
});
