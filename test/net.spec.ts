import * as chai from "chai"
import { Net } from "../src/neural/net"

const expect = chai.expect

describe("Neural Net", () => {
  it("constructs a net with all neurons", () => {
    const net = new Net()

    expect(net.layers.length).to.equal(3)
  })
})
