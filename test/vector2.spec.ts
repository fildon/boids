import * as chai from "chai";
import * as mocha from "mocha";
import { Vector2 } from "../src/vector2";

const expect = chai.expect;

describe("Vector2", () => {
    describe("distance", () => {
        it("computes 3-4-5 triangle", () => {
            const v0 = new Vector2(0, 0);
            const v1 = new Vector2(3, 4);
            const distance = v0.distance(v1);
            expect(distance).to.equal(5);
        });

        it("handles 0 distance", () => {
            expect(
                new Vector2(1, 1).distance(new Vector2(1, 1)),
            ).to.equal(0);
        });
    });

    describe("vectorTo", () => {
        it("computes the distance from one vector to another", () => {
            const v0 = new Vector2(1, 1);
            const v1 = new Vector2(2, 3);
            const actual = v0.vectorTo(v1);
            const expected = new Vector2(1, 2);
            expect(actual.equals(expected)).to.be.true;
        });
    });
});
