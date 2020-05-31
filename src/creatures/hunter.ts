import { config } from '../stateManagement/config';
import { Vector } from '../geometry/vector';
import { Creature } from './creature';
import { CreatureStorage } from '../stateManagement/creatureStorage';
import { Boid } from './boid';

export class Hunter extends Creature {
  public colour = config.hunter.defaultColour;
  public maxSpeed = config.hunter.maxSpeed;
  public minSpeed = config.hunter.minSpeed;
  public size = config.hunter.size;
  public heading = 0;
  public speed = 0;
  public history: Vector[] = [];
  public position: Vector;

  constructor(
    public readonly id: number = 0,
    public creatureStorage: CreatureStorage,
    position?: Vector,
  ) {
    super();
    this.position = position || new Vector(
      Math.random() * config.screen.maxX,
      Math.random() * config.screen.maxY,
    );
    for (let i = 0; i < config.creature.maxHistory; i++) {
      this.history.push(this.position);
    }
    this.initializeVelocity();
  }

  public initializeVelocity(): void {
    this.heading = Math.random() * 2 * Math.PI;
    this.speed = config.hunter.minSpeed;
  }

  public update(): void {
    this.eat();
    this.move();
    this.updateHistory();
  }

  public eat(): void {
    this.creatureStorage.getBoidsInArea(
      this.position,
      config.hunter.eatRadius,
    ).forEach((prey) => prey.die());
  }

  public move(): void {
    this.position = this.position.add(this.velocity()).normalize();
  }

  public getPerceptionOf(boid: Boid | null): number[] {
    if (!boid) {
      return [NaN, NaN];
    }

    const shortestPath = this.position.vectorTo(boid.position);

    const targetHeadingRadians = this.velocity().angleTo(shortestPath);
    const normalisedAngle = (targetHeadingRadians / (2 * Math.PI)) + 0.5;

    // Distance here is a value from 0 to 1, with 1 representing 500 or more pixels away. 
    const normalisedDistance = Math.min(500, shortestPath.length) / 500;
    return [normalisedAngle, normalisedDistance];
  }

  public applyDecision(rotationDecision: number, accelerationDecision: number): void {
    rotationDecision = isNaN(rotationDecision) ? Math.random() : rotationDecision;
    accelerationDecision = isNaN(accelerationDecision) ? Math.random() : accelerationDecision;

    const maximumLeft = this.heading - config.creature.turningMax;
    const fullTurningRange = config.creature.turningMax * 2;
    this.heading = maximumLeft + rotationDecision * fullTurningRange;

    const minimumSpeed = this.speed - config.creature.acceleration;
    const fullSpeedRange = config.creature.acceleration * 2;
    const targetSpeed = minimumSpeed + fullSpeedRange * accelerationDecision;
    this.speed = Math.min(Math.max(targetSpeed, 0), config.hunter.maxSpeed);

    this.move();
  }
}
