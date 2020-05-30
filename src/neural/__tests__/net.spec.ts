import { Net } from '../net';

describe('Neural Net', () => {
  it('constructs a net with all neurons', () => {
    const net = new Net([0, 0, 0]);

    expect(net.layers).toHaveLength(3);
  });
});
