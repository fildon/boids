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
    });
});
