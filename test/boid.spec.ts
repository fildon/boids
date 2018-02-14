import * as chai from "chai";
import * as mocha from "mocha";
import { Boid } from "../src/boid";
import { config } from "../src/config";
import { Vector2 } from "../src/vector2";

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

    describe("nearest neighbour", () => {
        it("throws if no other boids", () => {
            const boid = new Boid();
            expect(boid.nearestNeighbour.bind(boid)).to.throw();
        });

        it("returns the nearest boid", () => {
            const boid = new Boid();
            const nearBoid = new Boid();
            const farBoid = new Boid();
            boid.position = new Vector2(0, 0);
            nearBoid.position = new Vector2(1, 0);
            farBoid.position = new Vector2(1, 1);
            boid.otherBoids = [nearBoid, farBoid];
            expect(boid.nearestNeighbour()).to.equal(nearBoid);
        });
    });
});
