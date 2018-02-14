import * as chai from "chai";
import * as mocha from "mocha";
import { Boid } from "../src/boid";
import { config } from "../src/config";

const expect = chai.expect;

describe("Boid", () => {
    describe("constructor", () => {
        it("clips position inside area", () => {
            const boid = new Boid();
            expect(boid.position.x).to.be.gte(10);
            expect(boid.position.x).to.be.lte(90);
            expect(boid.position.y).to.be.gte(10);
            expect(boid.position.x).to.be.lte(90);
        });

        it("sets an intitial speed matching the config", () => {
            const boid = new Boid();
            expect(boid.velocity.length()).to.approximately(config.speed, 0.0000001);
        });
    });
});
