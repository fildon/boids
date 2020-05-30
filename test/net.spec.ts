import * as chai from "chai"
import { Net } from "neural/net"

const expect = chai.expect

describe("Neural Net", () => {
  it("constructs a net with all neurons", () => {
    const net = new Net([0, 0, 0])

    expect(net.layers.length).to.equal(3)
  })
})
