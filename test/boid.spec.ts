import * as chai from "chai";
import * as mocha from "mocha";
import * as sinon from "sinon";
import { config } from "../src/config";
import { Vector2 } from "../src/vector2";
import { CreatureStorage } from "../src/creatureStorage";

const expect = chai.expect;

describe("Boid", () => {
    let creatureStorage: CreatureStorage;
    beforeEach(() => {
        creatureStorage = new CreatureStorage();
    });

    describe("constructor", () => {
        it("clips position inside area", () => {
            const boid = creatureStorage.addBoid();
            expect(boid.position.x).to.be.gte(0);
            expect(boid.position.x).to.be.lte(config.screen.maxX);
            expect(boid.position.y).to.be.gte(0);
            expect(boid.position.y).to.be.lte(config.screen.maxY);
        });
    });

    describe("movement", () => {
        it("adds velocity to position", () => {
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2(10, 20);
            boid.velocity = new Vector2(30, 40);
            boid.move();
            const expected = new Vector2(40, 60);
            expect(boid.position).to.deep.equal(expected);
        });
    });

    describe("repulsion", () => {
        it("gets a repulsion vector with one boid too near", () => {
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2();
            const boidA = creatureStorage.addBoid();
            boidA.position = new Vector2(1, 1).scaleToLength(config.boid.repulsionRadius / 2);
            creatureStorage.update();

            const actual = boid.repulsionVector();
            const expected = new Vector2(-1, -1);

            expect(actual).not.to.be.null;
            expect(actual!.isParallelTo(expected)).to.be.true;
        });

        it("gets a repulsion vector with multiple boids too near", () => {
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2();
            const boidA = creatureStorage.addBoid();
            boidA.position = new Vector2(0, 1).scaleToLength(config.boid.repulsionRadius / 2);
            const boidB = creatureStorage.addBoid();
            boidB.position = new Vector2(1, 0).scaleToLength(config.boid.repulsionRadius / 2);
            creatureStorage.update();

            const actual = boid.repulsionVector()!;
            const expected = new Vector2(-1, -1);

            expect(actual.isParallelTo(expected)).to.be.true;
        });
    });

    describe("attraction", () => {
        it("returns null if no other boids in range", () => {
            const boid = creatureStorage.addBoid();

            const actual = boid.attractionVector();

            expect(actual).to.equal(null);
        });

        it("attracts to sole boid in range", () => {
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2();
            const nearBoid = creatureStorage.addBoid();
            nearBoid.position = new Vector2(1, 1);
            creatureStorage.update();

            const actual = boid.attractionVector()!;
            const expected = new Vector2(1, 1).scaleToLength(boid.velocity.length);

            expect(actual.isParallelTo(expected)).to.be.true;
        });

        it("attracts only to nearest of multiple near boids", () => {
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2();
            const boidNearer = creatureStorage.addBoid();
            boidNearer.position = new Vector2(1, 1);
            const boidFurther = creatureStorage.addBoid();
            boidFurther.position = new Vector2(1.1, 1.1);
            creatureStorage.update();

            const actual = boid.attractionVector()!;
            const expected = new Vector2(1, 1).scaleToLength(boid.velocity.length);

            expect(actual.isParallelTo(expected)).to.be.true;
        });
    });

    describe("wallAvoidVector", () => {
        it("points away from the edges", () => {
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2();
            const expected = new Vector2(1, 1).scaleToLength(boid.velocity.length);
            expect(boid.wallAvoidVector()!).to.deep.equal(expected);
        });

        it("points away from the edges", () => {
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2(config.screen.maxX, config.screen.maxY);
            const expected = new Vector2(-1, -1).scaleToLength(boid.velocity.length);
            expect(boid.wallAvoidVector()!).to.deep.equal(expected);
        });

        it("points away from the edges", () => {
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2(0, config.screen.maxY);
            const expected = new Vector2(1, -1).scaleToLength(boid.velocity.length);
            expect(boid.wallAvoidVector()!).to.deep.equal(expected);
        });

        it("points away from the edges", () => {
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2(config.screen.maxX, 0);
            const expected = new Vector2(-1, 1).scaleToLength(boid.velocity.length);
            expect(boid.wallAvoidVector()!).to.deep.equal(expected);
        });

        it("does not repel exactly at wall avoid radius", () => {
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2(
                config.creature.wallAvoidRadius,
                config.creature.wallAvoidRadius,
            );
            expect(boid.wallAvoidVector()).to.equal(null);
        });

        it("does not repel exactly at wall avoid radius", () => {
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2(
                config.screen.maxX - config.creature.wallAvoidRadius,
                config.screen.maxY - config.creature.wallAvoidRadius,
            );
            expect(boid.wallAvoidVector()).to.equal(null);
        });
    });

    describe("mouse avoid vector", () => {
        const mouseAvoidRadiusOriginalValue = config.boid.mouseAvoidRadius;
        /* This before/after ensure that these tests 'make sense' even when
        I'm regularly playing around with the particulars of the config values */
        before(() => { 
            config.boid.mouseAvoidRadius = 10;
        });
        after(() => {
            config.boid.mouseAvoidRadius = mouseAvoidRadiusOriginalValue;
        });
        it("points away from the mouse when within it's radius", () => {
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2();
            boid.mousePosition = new Vector2(1, 1);
            const actual = boid.mouseAvoidVector()!;
            const expected = new Vector2(-1, -1).scaleToLength(config.boid.maxSpeed);
            expect(actual.distance(expected)).to.be.lessThan(0.0000001);
        });

        it("uses strict equality distance checking", () => {
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2();
            boid.mousePosition = new Vector2(config.boid.mouseAvoidRadius, 0);
            const actual = boid.mouseAvoidVector();
            expect(actual).to.equal(null);
        });

        it("returns null if mouse is out of area", () => {
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2();
            boid.mousePosition = null;
            const actual = boid.mouseAvoidVector();
            expect(actual).to.equal(null);
        });
    });

    describe("update heading towards", () => {
        before(() => {
            sinon.stub(Math, 'random').returns(0.5);
        });
        it("limits the turn by the turningMax", () => {
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2();
            boid.velocity = new Vector2(1, 1).scaleToLength(config.boid.maxSpeed);
            const expected = boid.velocity.rotate(config.creature.turningMax);
            boid.updateHeadingTowards(new Vector2(-100, -99));
            const actual = boid.velocity;
            expect(actual.distance(expected)).to.be.lte(0.0001);
        });

        it("limits the turn by the turningMax", () => {
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2();
            boid.velocity = new Vector2(1, 1).scaleToLength(config.boid.maxSpeed);
            const expected = boid.velocity.rotate(-config.creature.turningMax);
            boid.updateHeadingTowards(new Vector2(-99, -100));
            const actual = boid.velocity;
            expect(actual.distance(expected)).to.be.lte(0.0001);
        });
    });

    describe("update heading", () => {
        it("rotates by a boundedly random turn if no ideal vectors", () => {
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2(500, 500);
            boid.velocity = new Vector2(1, 1);
            const expectedMin = boid.velocity.rotate(-config.creature.turningMax);
            boid.updateHeading();
            expect(expectedMin.angleTo(boid.velocity)).to.be.lt(config.creature.turningMax * 2);
        });
    });
});
