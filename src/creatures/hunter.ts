import { config } from '../stateManagement/config';
import { Vector } from '../geometry/vector';
import { Creature } from './creature';
import { CreatureStorage } from '../stateManagement/creatureStorage';
import { Net } from '../neural/net';

const netSizeSchema = [1, 3, 2];

export class Hunter extends Creature {
  public colour: string;
  public maxSpeed: number;
  public minSpeed: number;
  public size: number;
  public heading: number;
  public speed: number;
  public history: Vector[];
  public position: Vector;
  private net: Net;

  constructor(
    public readonly id: number = 0,
    public creatureStorage: CreatureStorage,
    position?: Vector,
  ) {
    super();
    this.colour = config.hunter.defaultColour;
    this.maxSpeed = config.hunter.maxSpeed;
    this.minSpeed = config.hunter.minSpeed;
    this.size = config.hunter.size;
    this.heading = 0;
    this.speed = 0;
    this.history = [];
    this.position = position || new Vector(
      Math.random() * config.screen.maxX,
      Math.random() * config.screen.maxY,
    );
    for (let i = 0; i < config.creature.maxHistory; i++) {
      this.history.push(this.position);
    }
    this.initializeVelocity();

    this.net = new Net(netSizeSchema);
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
    this.updateHistory();
    this.position = this.position.add(this.velocity()).normalize();
    const inputVector = this.getNeuralNetInputVector();
    const outputVector = this.net.processInput(inputVector);
    this.parseOutputToAction(outputVector);

    // TODO ... update net to learn?
  }

  private getNeuralNetInputVector(): number[] {
    // TODO this will error if there are no boids
    const nearestBoid = this.creatureStorage.getAllBoids().sort((a, b) => {
      return a.distanceToCreature(this) - b.distanceToCreature(this);
    })[0];

    const shortestPath = this.position.vectorTo(nearestBoid.position);

    const targetHeadingRadians = this.velocity().angleTo(shortestPath);
    const normalisedTarget = (targetHeadingRadians / (2 * Math.PI)) + 0.5;
    return [normalisedTarget];
  }

  private parseOutputToAction(outputVector: number[]): void {
    const rotationDecision = outputVector[0];
    const maximumLeft = this.heading - config.creature.turningMax;
    const fullTurningRange = config.creature.turningMax * 2;
    this.heading = maximumLeft + rotationDecision * fullTurningRange;

    const accelerationDecision = outputVector[1];
    const minimumSpeed = this.speed - config.creature.acceleration;
    const fullSpeedRange = config.creature.acceleration * 2;
    const targetSpeed = minimumSpeed + fullSpeedRange * accelerationDecision;
    this.speed = Math.min(Math.max(targetSpeed, 0), config.hunter.maxSpeed);
  }
}
