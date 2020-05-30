import { config } from "stateManagement/config";
import { Vector2 } from "geometry/vector2";
import { CreatureStorage } from "stateManagement/creatureStorage";
import { InputHandler } from "ui/inputHandler";

describe.skip("Boid", () => {
  let creatureStorage: CreatureStorage;
  beforeEach(() => {
    // const inputHandlerMock = <InputHandler> <any> (sinon.mock(InputHandler));
    // creatureStorage = new CreatureStorage(inputHandlerMock);
  });

  describe("constructor", () => {
    it("clips position inside area", () => {
      const boid = creatureStorage.addBoid();
      // expect(boid.position.x).to.be.gte(0);
      // expect(boid.position.x).to.be.lte(config.screen.maxX);
      // expect(boid.position.y).to.be.gte(0);
      // expect(boid.position.y).to.be.lte(config.screen.maxY);
    });
  });

  describe("update", () => {
    it("becomes afraid", () => {
      const boid = creatureStorage.addBoid();
      boid.fearCountdown = 10;

      boid.update();

      // expect(boid.fearCountdown).to.equal(9);
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

      // expect(actual).not.to.be.null;
      // expect(actual!.vector.isParallelTo(expected)).to.be.true;
    });

    it("gets a repulsion vector with multiple boids too near", () => {
      const boid = creatureStorage.addBoid();
      boid.position = new Vector2();
      const boidA = creatureStorage.addBoid();
      boidA.position = new Vector2(0, 1).scaleToLength(config.boid.repulsionRadius / 2);
      const boidB = creatureStorage.addBoid();
      boidB.position = new Vector2(1, 0).scaleToLength(config.boid.repulsionRadius / 2);
      creatureStorage.update();

      const actual = boid.repulsion()!;
      const expected = new Vector2(-1, -1);

      // expect(actual.vector.isParallelTo(expected)).to.be.true;
    });
  });

  describe("attraction", () => {
    it("returns zero weighted vector if no other boids in range", () => {
      const boid = creatureStorage.addBoid();

      const actual = boid.attraction();

      // expect(actual.weight).to.equal(0);
    });

    it("attracts to sole boid in range", () => {
      const boid = creatureStorage.addBoid();
      boid.position = new Vector2();
      const nearBoid = creatureStorage.addBoid();
      nearBoid.position = new Vector2(1, 1);
      creatureStorage.update();

      const actual = boid.attraction()!;
      const expected = new Vector2(1, 1).scaleToLength(boid.velocity.length);

      // expect(actual.vector.isParallelTo(expected)).to.be.true;
    });

    it("attracts only to nearest of multiple near boids", () => {
      const boid = creatureStorage.addBoid();
      boid.position = new Vector2();
      const boidNearer = creatureStorage.addBoid();
      boidNearer.position = new Vector2(1, 1);
      const boidFurther = creatureStorage.addBoid();
      boidFurther.position = new Vector2(1.1, 1.1);
      creatureStorage.update();

      const actual = boid.attraction()!;
      const expected = new Vector2(1, 1).scaleToLength(boid.velocity.length);

      // expect(actual.vector.isParallelTo(expected)).to.be.true;
    });
  });

  describe("update heading towards", () => {
    // before(() => {
    //   sinon.stub(Math, 'random').returns(0.5);
    // });

    it("limits the turn by the turningMax", () => {
      const boid = creatureStorage.addBoid();
      boid.position = new Vector2();
      boid.speed = config.boid.maxSpeed;
      boid.heading = Math.PI / 4;
      const expected = boid.heading + config.creature.turningMax;
      boid.updateHeadingTowards(new Vector2(-100, -99));
      const actual = boid.heading;
      // expect(Math.abs(actual - expected)).to.be.lte(0.0001);
    });

    it("limits the turn by the turningMax", () => {
      const boid = creatureStorage.addBoid();
      boid.position = new Vector2();
      boid.speed = config.boid.maxSpeed;
      boid.heading = Math.PI / 4;
      const expected = boid.heading - config.creature.turningMax;
      boid.updateHeadingTowards(new Vector2(-99, -100));
      const actual = boid.heading;
      // expect(Math.abs(actual - expected)).to.be.lte(0.0001);
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
      // expect(expectedMin - boid.heading).to.be.lt(config.creature.turningMax * 2);
    });
  });
});
