import { Canvas } from '../ui/canvas';
import { config } from './config';
import { InputHandler } from '../ui/inputHandler';
import { CreatureStorage } from './creatureStorage';
import { Vector } from '../geometry/vector';
import HunterPack from '../creatures/hunterPack';

export class SimulationManager {
  private canvas: Canvas;
  private creatureStorage: CreatureStorage;
  private packs: HunterPack[];
  private readonly fpsTarget = 60;
  constructor() {
    const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvasElement) {
      throw new Error('couldn\'t find \'canvas\' on document');
    }
    this.canvas = new Canvas(canvasElement);
    new InputHandler(
      this.canvas,
      (position: Vector) => this.createBoid(position),
      (position: Vector) => this.createHunter(position),
    );

    this.creatureStorage = new CreatureStorage();
    for (let i = 0; i < config.boid.quantity; i++) {
      this.creatureStorage.addBoid();
    }

    this.packs = [];
    for (let i = 0; i < config.pack.quantity; i++) {
      this.packs.push(this.createPack());
    }
  }

  private createPack(): HunterPack {
    const pack = new HunterPack(config.pack.size, this.creatureStorage);
    for (let i = 0; i < config.pack.size; i++) {
      const newHunter = this.creatureStorage.addHunter();
      pack.register(newHunter);
    }
    return pack;
  }

  public createBoid(position?: Vector): void {
    this.creatureStorage.addBoid(position);
  }

  public createHunter(position?: Vector): void {
    this.creatureStorage.addHunter(position);
  }

  public runSimulation(): void {
    this.tick(performance.now(), 0);
  }

  public tick(previousTime: number, lag: number): void {
    const currentTime = performance.now();
    const elapsed = currentTime - previousTime;
    previousTime = currentTime;
    lag += elapsed;

    while (lag >= 1000 / this.fpsTarget) {
      this.updateSimulation();
      lag -= 1000 / this.fpsTarget;
    }

    this.renderSimulation();
    setTimeout(() => this.tick(previousTime, lag), 0);
  }

  public updateSimulation(): void {
    this.creatureStorage.update();
    for (const boid of this.creatureStorage.getAllBoids()) {
      boid.update();
    }
    for (const pack of this.packs) {
      pack.update();
    }
  }

  public renderSimulation(): void {
    this.canvas.draw(
      this.creatureStorage.getAllCreatures(),
    );
    this.updateHunterCountDisplay(
      this.creatureStorage.getHunterCount(),
    );
    this.updateBoidCountDisplay(
      this.creatureStorage.getBoidCount(),
    );
  }

  private updateHunterCountDisplay(count: number) {
    const countDisplay = document.getElementById('number-of-hunters');
    if (countDisplay) {
      countDisplay.textContent = `${count}`;
    }
  }

  private updateBoidCountDisplay(count: number) {
    const countDisplay = document.getElementById('number-of-boids');
    if (countDisplay) {
      countDisplay.textContent = `${count}`;
    }
  }
}
