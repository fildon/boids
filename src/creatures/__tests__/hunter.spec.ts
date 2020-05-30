import { Vector2 } from "geometry/vector2";
import { CreatureStorage } from "stateManagement/creatureStorage";
import { InputHandler } from "ui/inputHandler";

describe.skip("Hunter", () => {
  let creatureStorage: CreatureStorage;
  beforeEach(() => {
    const inputHandlerMock = <InputHandler> <any> (sinon.mock(InputHandler));
    creatureStorage = new CreatureStorage(inputHandlerMock);
  });
  afterEach(() => {
    // sinon.restore();
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
