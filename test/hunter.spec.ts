import * as chai from "chai";
import * as mocha from "mocha";
import { Boid } from "../src/creatures/boid";
import { Creature } from "../src/creatures/creature";
import { Hunter } from "../src/creatures/hunter";
import { Vector2 } from "../src/vector2";

const expect = chai.expect;

describe("Hunter", () => {
    describe("hunting vector", () => {
        it("returns null if no prey in sight", () => {
            const hunter = new Hunter();

            const actual = hunter.huntingVector();

            expect(actual).to.equal(null);
        });

        it("points towards nearest prey in sight", () => {
            const creatures = new Map<number, Creature>();
            const hunter = new Hunter(0, creatures);
            const boid = new Boid(1, creatures);
            boid.velocity = new Vector2();
            creatures.set(0, hunter);
            creatures.set(1, boid);
            hunter.position = new Vector2(1, 1);
            boid.position = new Vector2(2, 3);

            const actual = hunter.huntingVector();
            const expected = new Vector2(1, 2);

            expect(actual).to.not.equal(null);
            expect(actual!.isParallelTo(expected)).to.be.true;
        });
    });

    describe("eating", () => {
        it("eats a boid in range", () => {
            const creatures = new Map<number, Creature>();
            const hunter = new Hunter(0, creatures);
            const boid = new Boid(1, creatures);

            hunter.eat();

            expect(creatures.has(1)).to.be.false;
        });
    });
});
