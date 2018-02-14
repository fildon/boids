import * as chai from "chai";
import * as mocha from "mocha";
import { Boid } from "../src/boid";

const expect = chai.expect;

describe("Boid", () => {
    describe("constructor", () => {
        it("clips position inside area", () => {
            const boid = new Boid();
            expect(boid.position.x).to.be.gte(10);
            expect(boid.position.x).to.be.lte(80);
            expect(boid.position.y).to.be.gte(10);
            expect(boid.position.x).to.be.lte(80);
        });
    });
});
