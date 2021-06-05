import { config } from "../stateManagement/config";
import { Vector } from "../geometry/vector";
import { Behaviour } from "./behaviour";
import { BehaviourControlledCreature } from "./behaviourControlledCreature";
import WeightedVector from "../geometry/weightedVector";
import { CreatureStorage } from "../stateManagement/creatureStorage";

export class Boid extends BehaviourControlledCreature {
  public defaultColour: string;
  public maxSpeed: number;
  public minSpeed: number;
  public size: number;
  public fearCountdown: number;
  public heading: number;
  public speed: number;
  public behaviours: Behaviour[];

  constructor(id: number, creatureStorage: CreatureStorage, position?: Vector) {
    super(id, creatureStorage, position);
    this.defaultColour = config.boid.defaultColour;
    this.maxSpeed = config.boid.maxSpeed;
    this.minSpeed = config.boid.minSpeed;
    this.size = config.boid.size;
    this.fearCountdown = 0;
    this.heading = 2 * Math.PI * Math.random();
    this.speed = config.boid.maxSpeed;
    this.behaviours = [
      new Behaviour(
        () => this.hunterEvasion(),
        () => "red"
      ),
      new Behaviour(
        () => this.repulsion(),
        () => (this.fearCountdown ? "red" : "orange")
      ),
      new Behaviour(
        () => this.alignment(),
        () => (this.fearCountdown ? "red" : "blue")
      ),
      new Behaviour(
        () => this.attraction(),
        () => (this.fearCountdown ? "red" : "green")
      ),
    ];
  }

  public initializeVelocity(): void {
    this.heading = Math.random() * 2 * Math.PI;
    this.speed = config.boid.maxSpeed;
  }

  public update(): void {
    if (this.fearCountdown) {
      this.fearCountdown--;
    }
    this.move();
  }

  public hunterEvasion(): WeightedVector {
    const huntersInSight = this.creatureStorage.getHuntersInArea(
      this.position,
      config.boid.visionRadius
    );
    if (huntersInSight.length === 0) {
      return new WeightedVector();
    }

    this.fearCountdown = config.boid.fearDuration;

    const nearestHunter = this.nearestCreatureToPosition(huntersInSight);

    const vectorToMe = nearestHunter.position.vectorTo(this.position);

    return new WeightedVector(vectorToMe.scaleToLength(this.maxSpeed), 100);
  }

  public repulsion(): WeightedVector {
    const neighbours = this.creatureStorage
      .getBoidsOrPlayersInArea(this.position, config.boid.repulsionRadius)
      .filter((boid) => boid !== this);
    if (neighbours.length === 0) {
      return new WeightedVector();
    }

    const repulsionVectors = neighbours
      .map((creature) => creature.position.vectorTo(this.position))
      .map(
        (vector) => new WeightedVector(vector, this.repulsionWeightFrom(vector))
      );
    const totalWeight = repulsionVectors.reduce((partialWeight, current) => {
      return partialWeight + current.weight;
    }, 0);

    return new WeightedVector(
      WeightedVector.average(repulsionVectors),
      totalWeight
    );
  }

  public repulsionWeightFrom(vector: Vector): number {
    const intrusion = config.boid.repulsionRadius - vector.length;
    const normalizedIntrusion = intrusion / config.boid.repulsionRadius;
    const smoothedIntrusion = Math.pow(normalizedIntrusion, 2);
    return smoothedIntrusion * config.boid.repulsionRadius;
  }

  public alignment(): WeightedVector {
    const neighbours = this.creatureStorage
      .getBoidsOrPlayersInArea(this.position, config.boid.alignmentRadius)
      .filter((boid) => boid !== this);
    if (neighbours.length === 0) {
      return new WeightedVector();
    }
    const averageAlignmentVector = Vector.average(
      neighbours.map((creature) => {
        return creature.velocity();
      })
    );
    return new WeightedVector(
      this.fearCountdown
        ? averageAlignmentVector.scaleToLength(this.maxSpeed)
        : averageAlignmentVector,
      15
    );
  }

  public attraction(): WeightedVector {
    const neighbours = this.creatureStorage
      .getBoidsOrPlayersInArea(this.position, config.boid.attractionRadius)
      .filter((boid) => boid !== this);
    if (neighbours.length === 0) {
      return new WeightedVector();
    }

    const nearestNeighbour = this.nearestCreatureToPosition(neighbours);

    return new WeightedVector(
      this.position
        .vectorTo(nearestNeighbour.position)
        .scaleToLength(
          this.fearCountdown ? this.maxSpeed : nearestNeighbour.speed * 1.1
        ),
      10
    );
  }

  public die(): void {
    this.creatureStorage.remove(this.id);
  }
}
