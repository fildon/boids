import { Creature } from '../creatures/creature';
import { Hunter } from '../creatures/hunter';
import { Boid } from '../creatures/boid';
import { Vector } from '../geometry/vector';
import { config } from './config';

export class CreatureStorage {
  private nextId = 0;
  private creatures = new Map<number, Creature>();
  private bucketMap: Creature[][][] = [];
  private bucketColumns = 1;
  private bucketRows = 1;
  private readonly bucketSize = 100;

  constructor() {
    this.update();
  }

  public update(): void {
    this.resetBucketMap();
    this.creatures.forEach((creature) => {
      const bucketX = Math.min(
        Math.floor(creature.position.x / this.bucketSize),
        this.bucketColumns - 1,
      );
      const bucketY = Math.min(
        Math.floor(creature.position.y / this.bucketSize),
        this.bucketRows - 1,
      );
      this.bucketMap[bucketX][bucketY].push(creature);
    });
  }

  public addHunter(position?: Vector): Hunter {
    const newHunter = new Hunter(
      this.nextId,
      this,
      position,
    );
    this.creatures.set(this.nextId, newHunter);
    this.nextId++;
    return newHunter;
  }

  public addBoid(position?: Vector): Boid {
    const newBoid = new Boid(
      this.nextId,
      this,
      position,
    );
    this.creatures.set(this.nextId, newBoid);
    this.nextId++;
    return newBoid;
  }

  public getAllHunters(): Hunter[] {
    return [...this.creatures.values()].filter((creature) => {
      return creature instanceof Hunter;
    }) as Hunter[];
  }

  public getAllBoids(): Boid[] {
    return [...this.creatures.values()].filter((creature) => {
      return creature instanceof Boid;
    }) as Boid[];
  }

  public getAllCreatures(): Creature[] {
    return [...this.creatures.values()];
  }

  public getHuntersInArea(center: Vector, radius: number): Hunter[] {
    return this.getCreaturesInArea(center, radius)
      .filter((creature) => {
        return creature instanceof Hunter &&
        creature.position.distance(center) < radius;
      }) as Hunter[];
  }

  public getBoidsInArea(center: Vector, radius: number): Boid[] {
    return this.getCreaturesInArea(center, radius)
      .filter((creature) => {
        return creature instanceof Boid &&
        creature.position.distance(center) < radius;
      }) as Boid[];
  }

  public getCreaturesInArea(center: Vector, radius: number): Creature[] {
    const bucketX = Math.floor(center.x / this.bucketSize);
    const bucketY = Math.floor(center.y / this.bucketSize);
    const bucketRadius = Math.ceil(radius / this.bucketSize);
    const minX = (bucketX - bucketRadius + this.bucketColumns) % this.bucketColumns;
    const maxX = (bucketX + bucketRadius + 1) % this.bucketColumns;
    const minY = (bucketY - bucketRadius + this.bucketRows) % this.bucketRows;
    const maxY = (bucketY + bucketRadius + 1) % this.bucketRows;
    let creatures: Creature[] = [];
    for (let i = minX; i !== maxX; i++, i = i % this.bucketColumns) {
      for (let j = minY; j !== maxY; j++, j = j % this.bucketRows) {
        creatures = creatures.concat(this.bucketMap[i][j]);
      }
    }
    return creatures;
  }

  public getHunterCount(): number {
    return this.getAllHunters().length;
  }

  public getBoidCount(): number {
    return this.getAllBoids().length;
  }

  public remove(creatureId: number): void {
    this.creatures.delete(creatureId);
  }

  private resetBucketMap(): void {
    this.bucketMap = [];
    this.bucketColumns = Math.ceil(config.screen.maxX / this.bucketSize);
    this.bucketRows = Math.ceil(config.screen.maxY / this.bucketSize);
    for (let i = 0; i < this.bucketColumns; i++) {
      const bucketRow: Creature[][] = [];
      for (let j = 0; j < this.bucketRows; j++) {
        bucketRow.push([]);
      }
      this.bucketMap.push(bucketRow);
    }
  }
}
