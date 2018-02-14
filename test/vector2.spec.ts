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

    describe("equality", () => {
        it("compares x y values, not object equality", () => {
            const v0 = new Vector2(0, 1);
            const v1 = new Vector2(0, 1);
            expect(v0.equals(v1)).to.equal(true);
        });
    });

    describe("vectorTo", () => {
        it("computes the distance from one vector to another", () => {
            const v0 = new Vector2(1, 1);
            const v1 = new Vector2(2, 3);
            const actual = v0.vectorTo(v1);
            const expected = new Vector2(1, 2);
            expect(actual.equals(expected)).to.equal(true);
        });
    });

    describe("rotate", () => {
        it("rotates a vector", () => {
            const v0 = new Vector2(Math.sqrt(2), 0);
            const v1 = new Vector2(1, 1);
            v0.rotate(Math.PI / 4);
            // We can't test exact equality due to tiny rounding errors
            expect(v0.distance(v1)).to.be.lessThan(0.0000001);
        });
    });

    describe("clip", () => {
        it("does not clip a vector inside the bounds", () => {
            const v0 = new Vector2(1, 1);
            v0.clip(0, 2, 0, 2);
            expect(v0.x).to.equal(1);
            expect(v0.y).to.equal(1);
        });

        it("clips x and y", () => {
            const v0 = new Vector2(1 , 1);
            v0.clip(2, 3, 0, 1);
            expect(v0.x).to.equal(2);
            expect(v0.y).to.equal(1);
        });
    });
});
