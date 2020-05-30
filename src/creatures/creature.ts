import { Vector } from '../geometry/vector';

export abstract class Creature {
  public abstract position: Vector;
  public abstract heading: number;
  public abstract speed: number;
  public abstract history: Vector[];
  public abstract colour: string;
  public abstract size: number;

  public distanceToCreature(creature: Creature): number {
    return this.position.distance(creature.position);
  }

  public abstract update(): void;

  public updateHistory(): void {
    this.history.push(this.position);
    this.history = this.history.slice(1);
  }

  public velocity(): Vector {
    return Vector.fromHeadingAndSpeed(this.heading, this.speed);
  }
}
