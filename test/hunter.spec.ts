import * as chai from "chai";
import * as mocha from "mocha";
import * as sinon from "sinon";
import { Vector2 } from "../src/vector2";
import { CreatureStorage } from "../src/creatureStorage";
import { AssertionError } from "assert";

const expect = chai.expect;

describe("Hunter", () => {
    let creatureStorage: CreatureStorage;
    beforeEach(() => {
        creatureStorage = new CreatureStorage();
    });

    describe("update", () => {
        it("eats before moving", () => {
            const hunter = creatureStorage.addHunter();
            const boid = creatureStorage.addBoid();
            hunter.position = new Vector2(1, 1);
            boid.position = new Vector2(1, 1);
            const boidDieSpy = sinon.spy(boid, "die");

            hunter.update();

            expect(boidDieSpy.calledOnce);
        })
    });

    describe("hunting vector", () => {
        it("returns null if no prey in sight", () => {
            const hunter = creatureStorage.addHunter();

            const actual = hunter.huntingVector();

            expect(actual).to.equal(null);
        });

        it("points towards nearest prey in sight", () => {
            const hunter = creatureStorage.addHunter();
            const boid = creatureStorage.addBoid();
            boid.velocity = new Vector2();
            hunter.position = new Vector2(1, 1);
            boid.position = new Vector2(2, 3);
            creatureStorage.update();

            const actual = hunter.huntingVector();
            const expected = new Vector2(1, 2);

            expect(actual).to.not.equal(null);
            expect(actual!.isParallelTo(expected)).to.be.true;
        });
    });

    describe("eating", () => {
        it("eats a boid in range", () => {
            const hunter = creatureStorage.addHunter();
            hunter.position = new Vector2();
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2();
            creatureStorage.update();

            hunter.eat();

            expect(creatureStorage.getBoidCount()).to.equal(0);
        });

        it("does not eat a boid out of range", () => {
            const hunter = creatureStorage.addHunter();
            hunter.position = new Vector2(0, 0);
            const boid = creatureStorage.addBoid();
            boid.position = new Vector2(100, 100);
            creatureStorage.update();

            hunter.eat();

            expect(creatureStorage.getBoidCount()).to.equal(1);
        });
    });
});
