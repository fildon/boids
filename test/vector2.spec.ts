import * as chai from "chai";
import * as mocha from "mocha";
import { Vector2 } from "../src/vector2";

const expect = chai.expect;

// We can't always test exact equality due to tiny rounding errors
// Particularly during rotations
const fuzzyVectorEquality = (v1: Vector2, v2: Vector2) => {
    return v1.distance(v2) < 0.0000001;
};

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
            const v2 = v0.rotate(Math.PI / 4);
            expect(fuzzyVectorEquality(v2, v1)).to.equal(true);
        });
    });

    describe("rotateAwayFrom", () => {
        it("handles clockwise rotation", () => {
            const v0 = new Vector2(1, 1);
            const v1 = new Vector2(1, 2);
            const v2 = v0.rotateAwayFrom(v1, Math.PI / 4);
            const expected = new Vector2(Math.sqrt(2), 0);
            expect(fuzzyVectorEquality(expected, v2)).to.equal(true);
        });
        it("handles anticlockwise rotation", () => {
            const v0 = new Vector2(1, 1);
            const v1 = new Vector2(2, 1);
            const v2 = v0.rotateAwayFrom(v1, Math.PI / 4);
            const expected = new Vector2(0, Math.sqrt(2));
            expect(fuzzyVectorEquality(expected, v2)).to.equal(true);
        });
        it("handles clipped clockwise rotation", () => {
            const v0 = new Vector2(1, 1);
            const v1 = new Vector2(0, -1);
            const v2 = v0.rotateAwayFrom(v1, Math.PI / 2);
            const expected = new Vector2(0, Math.sqrt(2));
            expect(fuzzyVectorEquality(expected, v2)).to.equal(true);
        });
        it("handles clipped anticlockwise rotation", () => {
            const v0 = new Vector2(1, 1);
            const v1 = new Vector2(-1, 0);
            const v2 = v0.rotateAwayFrom(v1, Math.PI / 2);
            const expected = new Vector2(Math.sqrt(2), 0);
            expect(fuzzyVectorEquality(expected, v2)).to.equal(true);
        });
    });

    describe("clip", () => {
        it("does not clip a vector inside the bounds", () => {
            const v0 = new Vector2(1, 1);
            const v1 = v0.clip(0, 2, 0, 2);
            expect(v1.x).to.equal(1);
            expect(v1.y).to.equal(1);
        });

        it("clips x and y", () => {
            const v0 = new Vector2(1 , 1);
            const v1 = v0.clip(2, 3, 0, 1);
            expect(v1.x).to.equal(2);
            expect(v1.y).to.equal(1);
        });
    });

    describe("add", () => {
        it("adds two vectors together", () => {
            const v0 = new Vector2(1, 2);
            const v1 = new Vector2(3, 4);
            const v2 = v0.add(v1);
            expect(v2.x).to.equal(4);
            expect(v2.y).to.equal(6);
        });
    });

    describe("average", () => {
        it("returns the zero vector if none input", () => {
            const actual = Vector2.average([]);
            expect(actual.x).to.equal(0);
            expect(actual.y).to.equal(0);
        });

        it("returns the same vector if only one input", () => {
            const v = new Vector2(1, 1);
            const actual = Vector2.average([v]);
            expect(actual.x).to.equal(v.x);
            expect(actual.y).to.equal(v.y);
        });

        it("returns the average of two or more vectors", () => {
            const v1 = new Vector2(0, 0);
            const v2 = new Vector2(2, 2);
            const v3 = new Vector2(0, 2);
            const v4 = new Vector2(2, 0);

            const expected = new Vector2(1, 1);
            const actual = Vector2.average([v1, v2, v3, v4]);

            expect(actual.x).to.equal(expected.x);
            expect(actual.y).to.equal(expected.y);
        });
    });
});
