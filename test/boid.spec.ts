import * as chai from "chai";
import * as mocha from "mocha";
import { Boid } from "../src/boid";

const expect = chai.expect;

describe("Boid", () => {
    describe("random colour generator", () => {
        it("generates a valid colour string", () => {
            const colour = Boid.randomColor();
            const regex = /^hsl\([0-9]*\.[0-9]*, 50%, 50%\)$/;
            expect(regex.test(colour)).to.equal(true);
        });
    });
});
