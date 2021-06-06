import { config } from "../stateManagement/config";
import { Vector } from "../geometry/vector";
import { Behaviour } from "./behaviour";
import { Priority } from "./priority";
import { CreatureStorage } from "../stateManagement/creatureStorage";
import { Creature } from "./creature";
import WeightedVector from "../geometry/weightedVector";

export abstract class BehaviourControlledCreature extends Creature {
  public abstract defaultColour: string;
  public colour: string;
  public abstract behaviours: Behaviour[];
  public abstract maxSpeed: number;
  public abstract minSpeed: number;
  public position: Vector;
  public history: Vector[];

  constructor(
    public readonly id: number = 0,
    public creatureStorage: CreatureStorage,
    position?: Vector
  ) {
    super();
    (this.colour = "black"),
      (this.position =
        position ||
        new Vector(
          Math.random() * config.screen.maxX,
          Math.random() * config.screen.maxY
        ));
    this.history = [];
    for (let i = 0; i < config.creature.maxHistory; i++) {
      this.history.push(this.position);
    }
    this.initializeVelocity();
  }

  public abstract initializeVelocity(): void;

  public distanceToCreature(creature: Creature): number {
    return this.position.distance(creature.position);
  }

  public abstract update(): void;

  public move(): void {
    this.updateHistory();
    this.position = this.position.add(this.velocity()).normalize();
    this.updateHeading();
  }

  public updateHeading(): void {
    const priorities = this.getCurrentPriorities().sort(
      (a, b) => b.weightedVector.weight - a.weightedVector.weight
    );
    if (priorities.length === 0) {
      this.defaultBehaviour();
      return;
    }
    this.colour = priorities[0].color;
    this.updateHeadingTowards(
      WeightedVector.average(
        priorities.map((priority) => priority.weightedVector)
      )
    );
  }

  public getCurrentPriorities(): Priority[] {
    return this.behaviours
      .map((behaviour) => behaviour.getCurrentPriority())
      .filter(
        (priority) =>
          priority &&
          priority.weightedVector.vector.length &&
          priority.weightedVector.weight
      );
  }

  public defaultBehaviour(): void {
    this.colour = this.defaultColour;
    this.speed = Math.max(
      this.velocity.length - config.creature.acceleration,
      this.minSpeed
    );
    const randomTurn =
      2 * config.creature.turningMax * Math.random() -
      config.creature.turningMax;
    this.heading = this.heading + randomTurn;
  }

  public updateHeadingTowards(vector: Vector | null): void {
    if (!vector) {
      return;
    }
    let limitedSpeed = Math.max(
      Math.min(vector.length, this.maxSpeed),
      this.minSpeed
    );
    limitedSpeed = Math.max(
      Math.min(limitedSpeed, this.speed + config.creature.acceleration),
      this.speed - config.creature.acceleration
    );
    this.speed = limitedSpeed;

    const idealTurn = this.velocity().angleTo(vector);
    const limitedTurn = Math.max(
      Math.min(idealTurn, config.creature.turningMax),
      -config.creature.turningMax
    );

    this.heading =
      this.heading +
      limitedTurn +
      2 * config.creature.headingFuzz * Math.random() -
      config.creature.headingFuzz;
  }

  public nearestCreatureToPosition(creatures: Creature[]): Creature {
    if (creatures.length === 0) {
      throw new Error("Nearest creature is undefined for zero creatures");
    }
    return creatures.reduce(
      (previous, current) => {
        const currentDistance = this.position.vectorTo(current.position).length;
        if (previous.distance > currentDistance) {
          return {
            distance: currentDistance,
            nearest: current,
          };
        }
        return previous;
      },
      {
        distance: this.position.vectorTo(creatures[0].position).length,
        nearest: creatures[0],
      }
    ).nearest;
  }

  public abstract die(): void;
}
