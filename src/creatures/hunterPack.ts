import { Hunter } from './hunter';
import { Net } from '../neural/net';
import { Boid } from './boid';
import { CreatureStorage } from '../stateManagement/creatureStorage';

export default class HunterPack {
  private hunters: Hunter[] = [];
  private net: Net;
  constructor(size: number, private creatureStorage: CreatureStorage) {
    // Each hunter outputs a 2-value perception and takes a 2-value decision
    this.net = new Net([2 * size, 6, 2 * size]);
  }

  public register(hunter: Hunter): void {
    this.hunters.push(hunter);
  }

  public update(): void {
    this.hunters.map(hunter => {
      hunter.eat();
      hunter.updateHistory();
    });

    const targetBoid = this.getNearestBoid();
    console.log(targetBoid);

    const perceptions = this.hunters.map(
      hunter => hunter.getPerceptionOf(targetBoid)
    ).reduce((acc, curr) => acc.concat(curr), []);

    const outputVector = this.net.processInput(perceptions);

    for (let i = 0; i < this.hunters.length; i++) {
      this.hunters[i].applyDecision(outputVector[2 * i], outputVector[(2 * i) + 1]);
    }
  }

  private getNearestBoid(): Boid | null {
    return this.creatureStorage.getAllBoids()
      .sort((a, b) => this.distanceToBoid(a) - this.distanceToBoid(b))[0];
  }

  private distanceToBoid(boid: Boid): number {
    return Math.min(
      ...this.hunters.map(hunter => hunter.distanceToCreature(boid))
    );
  }
}
