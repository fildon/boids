import { config } from "stateManagement/config";
import { Vector2 } from "geometry/vector2";
import { CreatureStorage } from "stateManagement/creatureStorage";

describe("Boid", () => {
  let creatureStorage: CreatureStorage;
  beforeEach(() => {
    creatureStorage = new CreatureStorage();
  });

  describe("constructor", () => {
    it("clips position inside area", () => {
      const boid = creatureStorage.addBoid();
      expect(boid.position.x).toBeGreaterThanOrEqual(0);
      expect(boid.position.x).toBeLessThanOrEqual(config.screen.maxX);
      expect(boid.position.y).toBeGreaterThanOrEqual(0);
      expect(boid.position.y).toBeLessThanOrEqual(config.screen.maxY);
    });
  });

  describe("update", () => {
    it("becomes afraid", () => {
      const boid = creatureStorage.addBoid();
      boid.fearCountdown = 10;

      boid.update();

      expect(boid.fearCountdown).toBe(9);
    });
  });

  describe("repulsion", () => {
    it("gets a repulsion vector with one boid too near", () => {
      const boid = creatureStorage.addBoid();
      boid.position = new Vector2();
      const boidA = creatureStorage.addBoid();
      boidA.position = new Vector2(1, 1).scaleToLength(config.boid.repulsionRadius / 2);
      creatureStorage.update();

      const actual = boid.repulsion();
      const expected = new Vector2(-1, -1);

      expect(actual).toBeTruthy();
      expect(actual.vector.isParallelTo(expected)).toBe(true);
    });

    it("gets a repulsion vector with multiple boids too near", () => {
      const boid = creatureStorage.addBoid();
      boid.position = new Vector2();
      const boidA = creatureStorage.addBoid();
      boidA.position = new Vector2(0, 1).scaleToLength(config.boid.repulsionRadius / 2);
      const boidB = creatureStorage.addBoid();
      boidB.position = new Vector2(1, 0).scaleToLength(config.boid.repulsionRadius / 2);
      creatureStorage.update();

      const actual = boid.repulsion();
      const expected = new Vector2(-1, -1);

      expect(actual.vector.isParallelTo(expected)).toBe(true);
    });
  });

  describe("attraction", () => {
    it("returns zero weighted vector if no other boids in range", () => {
      const boid = creatureStorage.addBoid();

      const actual = boid.attraction();

      expect(actual.weight).toBe(0);
    });

    it("attracts to sole boid in range", () => {
      const boid = creatureStorage.addBoid();
      boid.position = new Vector2();
      const nearBoid = creatureStorage.addBoid();
      nearBoid.position = new Vector2(1, 1);
      creatureStorage.update();

      const actual = boid.attraction();
      const expected = new Vector2(1, 1).scaleToLength(boid.velocity.length);

      expect(actual.vector.isParallelTo(expected)).toBe(true);
    });

    it("attracts only to nearest of multiple near boids", () => {
      const boid = creatureStorage.addBoid();
      boid.position = new Vector2();
      const boidNearer = creatureStorage.addBoid();
      boidNearer.position = new Vector2(1, 1);
      const boidFurther = creatureStorage.addBoid();
      boidFurther.position = new Vector2(1.1, 1.1);
      creatureStorage.update();

      const actual = boid.attraction();
      const expected = new Vector2(1, 1).scaleToLength(boid.velocity.length);

      expect(actual.vector.isParallelTo(expected)).toBe(true);
    });
  });

  describe("update heading towards", () => {
    beforeAll(() => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5)
    });

    it("limits leftward turn by the turningMax", () => {
      const boid = creatureStorage.addBoid();
      boid.position = new Vector2();
      boid.speed = config.boid.maxSpeed;
      boid.heading = Math.PI / 4;
      const expected = boid.heading + config.creature.turningMax;
      boid.updateHeadingTowards(new Vector2(-100, -99));
      const actual = boid.heading;
      expect(actual).toBeCloseTo(expected);
    });

    it("limits rightward turn by the turningMax", () => {
      const boid = creatureStorage.addBoid();
      boid.position = new Vector2();
      boid.speed = config.boid.maxSpeed;
      boid.heading = Math.PI / 4;
      const expected = boid.heading - config.creature.turningMax;
      boid.updateHeadingTowards(new Vector2(-99, -100));
      const actual = boid.heading;
      expect(actual).toBeCloseTo(expected);
    });
  });

  describe("update heading", () => {
    it("rotates by a boundedly random turn if no ideal vectors", () => {
      const boid = creatureStorage.addBoid();
      boid.position = new Vector2(500, 500);
      boid.speed = config.boid.maxSpeed;
      boid.heading = Math.PI / 4;
      const expectedMin = boid.heading - config.creature.turningMax;
      boid.updateHeading();
      expect(boid.heading - expectedMin).toBeLessThan(config.creature.turningMax * 2);
    });
  });
});
