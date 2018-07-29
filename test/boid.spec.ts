import * as chai from "chai";
import * as mocha from "mocha";
import { config } from "../src/config";
import { Boid } from "../src/creatures/boid";
import { Creature } from "../src/creatures/creature";
import { Vector2 } from "../src/vector2";

const expect = chai.expect;

describe("Boid", () => {
    describe("constructor", () => {
        it("clips position inside area", () => {
            const boid = new Boid(0, new Map());
            expect(boid.position.x).to.be.gte(0);
            expect(boid.position.x).to.be.lte(config.maxX);
            expect(boid.position.y).to.be.gte(0);
            expect(boid.position.y).to.be.lte(config.maxY);
        });
    });

    describe("movement", () => {
        it("adds velocity to position", () => {
            const boid = new Boid(0, new Map());
            boid.position = new Vector2(10, 20);
            boid.velocity = new Vector2(30, 40);
            boid.move();
            const expected = new Vector2(40, 60);
            expect(boid.position.equals(expected)).to.equal(true);
        });
    });

    describe("repulsion", () => {
        it("gets a repulsion vector with one boid too near", () => {
            const creatures = new Map<number, Creature>();

            const boid = new Boid(0, creatures);
            boid.position = new Vector2(0, 0);
            const boidA = new Boid(1, creatures);
            boidA.position = new Vector2(1, 1).scaleToLength(config.repulsionRadius / 2);

            creatures.set(0, boid);
            creatures.set(1, boidA);

            const actual = boid.repulsionVector();
            const expected = new Vector2(-1, -1).scaleToLength(boid.velocity.length);

            expect(actual.distance(expected)).to.be.lte(0.0000001);
        });

        it("gets a repulsion vector with multiple boids too near", () => {
            const creatures = new Map<number, Creature>();

            const boid = new Boid(0, creatures);
            boid.position = new Vector2(0, 0);
            const boidA = new Boid(1, creatures);
            boidA.position = new Vector2(0, 1).scaleToLength(config.repulsionRadius / 2);
            const boidB = new Boid(2, creatures);
            boidB.position = new Vector2(1, 0).scaleToLength(config.repulsionRadius / 2);

            creatures.set(0, boid);
            creatures.set(1, boidA);
            creatures.set(2, boidB);

            const actual = boid.repulsionVector();
            const expected = new Vector2(-1, -1).scaleToLength(boid.velocity.length);

            expect(actual.distance(expected)).to.be.lte(0.0000001);
        });
    });

    describe("attraction", () => {
        it("returns the zero vector if no other boids in range", () => {
            const creatures = new Map<number, Creature>();

            const boid = new Boid(0, creatures);

            creatures.set(0, boid);

            const actual = boid.attractionVector();
            const expected = new Vector2(0, 0);

            expect(actual.distance(expected)).to.be.lte(0.0000001);
        });

        it("attracts to sole boid in range", () => {
            const creatures = new Map<number, Creature>();

            const boid = new Boid(0, creatures);
            boid.position = new Vector2(0, 0);
            const nearBoid = new Boid(1, creatures);
            nearBoid.position = new Vector2(1, 1);

            creatures.set(0, boid);
            creatures.set(1, nearBoid);

            const actual = boid.attractionVector();
            const expected = new Vector2(1, 1).scaleToLength(boid.velocity.length);

            expect(actual.distance(expected)).to.be.lte(0.0000001);
        });

        it("attracts to average of multiple near boids", () => {
            const creatures = new Map<number, Creature>();

            const boid = new Boid(0, creatures);
            boid.position = new Vector2(0, 0);
            const boidA = new Boid(1, creatures);
            boidA.position = new Vector2(1, 1);
            const boidB = new Boid(2, creatures);
            boidB.position = new Vector2(-1, 1);

            creatures.set(0, boid);
            creatures.set(1, boidA);
            creatures.set(2, boidB);

            const actual = boid.attractionVector();
            const expected = new Vector2(0, 1).scaleToLength(boid.velocity.length);

            expect(actual.distance(expected)).to.be.lte(0.0000001);
        });
    });

    describe("neighbours", () => {
        it("returns none if there are no other boids", () => {
            const boid = new Boid(0, new Map());

            const actual = boid.neighbours(10);

            expect(actual.length).to.equal(0);
        });

        it("returns none if there are no boids in range", () => {
            const boid = new Boid(0, new Map());
            boid.position = new Vector2(0, 0);
            const farBoid = new Boid(0, new Map());
            farBoid.position = new Vector2(1, 1);

            const actual = boid.neighbours(1);

            expect(actual.length).to.equal(0);
        });

        it("returns a boid in range", () => {
            const creatures = new Map<number, Creature>();

            const boid = new Boid(0, creatures);
            boid.position = new Vector2(0, 0);
            const nearBoid = new Boid(1, creatures);
            nearBoid.position = new Vector2(1, 1);

            creatures.set(0, boid);
            creatures.set(1, nearBoid);

            const actual = boid.neighbours(2);

            expect(actual.length).to.equal(1);
            expect(actual[0]).to.equal(nearBoid);
        });

        it("returns only those boids that are in range", () => {
            const creatures = new Map<number, Creature>();

            const boid = new Boid(0, creatures);
            boid.position = new Vector2(0, 0);
            const nearBoid = new Boid(1, creatures);
            nearBoid.position = new Vector2(0, 1);
            const farBoid = new Boid(2, creatures);
            farBoid.position = new Vector2(2, 0);

            creatures.set(0, boid);
            creatures.set(1, nearBoid);
            creatures.set(2, farBoid);

            const actual = boid.neighbours(2);

            expect(actual.length).to.equal(1);
            expect(actual[0]).to.be.equal(nearBoid);
        });
    });

    describe("wallAvoidVector", () => {
        it("points away from the edges", () => {
            const boid = new Boid(0, new Map());
            boid.position = new Vector2(0, 0);
            const expected = new Vector2(1, 1).scaleToLength(boid.velocity.length);
            expect(boid.wallAvoidVector().equals(expected)).to.equal(true);
        });

        it("points away from the edges", () => {
            const boid = new Boid(0, new Map());
            boid.position = new Vector2(config.maxX, config.maxY);
            const expected = new Vector2(-1, -1).scaleToLength(boid.velocity.length);
            expect(boid.wallAvoidVector().equals(expected)).to.equal(true);
        });

        it("points away from the edges", () => {
            const boid = new Boid(0, new Map());
            boid.position = new Vector2(0, config.maxY);
            const expected = new Vector2(1, -1).scaleToLength(boid.velocity.length);
            expect(boid.wallAvoidVector().equals(expected)).to.equal(true);
        });

        it("points away from the edges", () => {
            const boid = new Boid(0, new Map());
            boid.position = new Vector2(config.maxX, 0);
            const expected = new Vector2(-1, 1).scaleToLength(boid.velocity.length);
            expect(boid.wallAvoidVector().equals(expected)).to.equal(true);
        });

        it("does not repel exactly at wall avoid radius", () => {
            const boid = new Boid(0, new Map());
            boid.position = new Vector2(
                config.wallAvoidRadius,
                config.wallAvoidRadius,
            );
            const expected = new Vector2(0, 0);
            expect(boid.wallAvoidVector().equals(expected)).to.equal(true);
        });

        it("does not repel exactly at wall avoid radius", () => {
            const boid = new Boid(0, new Map());
            boid.position = new Vector2(
                config.maxX - config.wallAvoidRadius,
                config.maxY - config.wallAvoidRadius,
            );
            const expected = new Vector2(0, 0);
            expect(boid.wallAvoidVector().equals(expected)).to.equal(true);
        });
    });

    describe("mouse avoid vector", () => {
        it("points away from the mouse when within it's radius", () => {
            const boid = new Boid(0, new Map());
            boid.position = new Vector2(0, 0);
            boid.mousePosition = new Vector2(1, 1);
            const actual = boid.mouseAvoidVector();
            const expected = new Vector2(-1, -1).scaleToLength(config.boidSpeed);
            expect(actual.distance(expected)).to.be.lessThan(0.0000001);
        });

        it("uses strict equality distance checking", () => {
            const boid = new Boid(0, new Map());
            boid.position = new Vector2(0, 0);
            boid.mousePosition = new Vector2(config.mouseRadius, 0);
            const actual = boid.mouseAvoidVector();
            const expected = new Vector2(0, 0);
            expect(actual.equals(expected)).to.equal(true);
        });

        it("returns zero-vector if mouse is out of area", () => {
            const boid = new Boid(0, new Map());
            boid.position = new Vector2(0, 0);
            boid.mousePosition = new Vector2(-1, -1);
            const actual = boid.mouseAvoidVector();
            const expected = new Vector2(0, 0);
            expect(actual.equals(expected)).to.equal(true);
        });
    });

    describe("update heading towards", () => {
        it("limits the turn by the turningMax", () => {
            const boid = new Boid(0, new Map());
            boid.position = new Vector2(0, 0);
            boid.velocity = new Vector2(1, 1).scaleToLength(config.boidSpeed);
            const expected = boid.velocity.rotate(config.turningMax);
            boid.updateHeadingTowards(new Vector2(-100, -99));
            const actual = boid.velocity;
            expect(actual.distance(expected)).to.be.lte(0.0001);
        });

        it("limits the turn by the turningMax", () => {
            const boid = new Boid(0, new Map());
            boid.position = new Vector2(0, 0);
            boid.velocity = new Vector2(1, 1).scaleToLength(config.boidSpeed);
            const expected = boid.velocity.rotate(-config.turningMax);
            boid.updateHeadingTowards(new Vector2(-99, -100));
            const actual = boid.velocity;
            expect(actual.distance(expected)).to.be.lte(0.0001);
        });
    });

    describe("update heading", () => {
        it("rotates by a boundedly random turn if no ideal vectors", () => {
            const boid = new Boid(0, new Map());
            boid.position = new Vector2(500, 500);
            boid.velocity = new Vector2(1, 1);
            const expectedMin = boid.velocity.rotate(-config.turningMax);
            boid.updateHeading();
            expect(expectedMin.angleTo(boid.velocity) < config.turningMax * 2)
                .to.equal(true);
        });
    });
});
