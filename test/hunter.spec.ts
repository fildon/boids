import * as chai from "chai";
import * as mocha from "mocha";
import * as sinon from "sinon";
import { Vector2 } from "../src/vector2";
import { CreatureStorage } from "../src/creatureStorage";
import { InputHandler } from "../src/inputHandler";

const expect = chai.expect;

describe("Hunter", () => {
  let creatureStorage: CreatureStorage;
  beforeEach(() => {
    const inputHandlerMock = <InputHandler> <any> (sinon.mock(InputHandler));
    creatureStorage = new CreatureStorage(inputHandlerMock);
  });
  afterEach(() => {
    sinon.restore();
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
