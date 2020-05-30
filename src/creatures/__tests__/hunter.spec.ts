import { Vector2 } from "geometry/vector2";
import { CreatureStorage } from "stateManagement/creatureStorage";

describe("Hunter", () => {
  let creatureStorage: CreatureStorage;
  beforeEach(() => {
    creatureStorage = new CreatureStorage();
  });

  describe("eating", () => {
    it("eats a boid in range", () => {
      const hunter = creatureStorage.addHunter();
      hunter.position = new Vector2();
      const boid = creatureStorage.addBoid();
      boid.position = new Vector2();
      creatureStorage.update();

      hunter.eat();

      expect(creatureStorage.getBoidCount()).toBe(0);
    });

    it("does not eat a boid out of range", () => {
      const hunter = creatureStorage.addHunter();
      hunter.position = new Vector2(0, 0);
      const boid = creatureStorage.addBoid();
      boid.position = new Vector2(100, 100);
      creatureStorage.update();

      hunter.eat();

      expect(creatureStorage.getBoidCount()).toBe(1);
    });
  });
});
