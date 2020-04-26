import { Canvas } from "./canvas";
import { InputHandler } from "./inputHandler";
import { CreatureStorage } from "./creatureStorage";
import { Vector2 } from "./vector2";
import { FpsCounter } from "./fpsCounter";

export class SimulationManager {
  private canvas: Canvas;
  private inputHandler: InputHandler;
  private creatureStorage: CreatureStorage;
  private addingBoids = true;
  private readonly fpsTarget = 60;
  constructor() {
    const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvasElement) {
      throw new Error("couldn't find 'canvas' on document");
    }
    this.canvas = new Canvas(canvasElement);
    this.inputHandler = new InputHandler(
      this.canvas,
      (position: Vector2) => this.createBoid(position),
      (position: Vector2) => this.createHunter(position),
    );

    this.creatureStorage = new CreatureStorage(this.inputHandler);
  }

  public createBoid(position?: Vector2) {
    this.creatureStorage.addBoid(position);
  }

  public createHunter(position?: Vector2) {
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
    if (this.addingBoids) {
      if (FpsCounter.getFpsCounter().getFPS() > this.fpsTarget * 1.2) {
        if (Math.random() < 0.2) {
          this.creatureStorage.addBoid();
        }
      } else {
        this.addingBoids = false;
      }
    }
    this.creatureStorage.update();
    for (const boid of this.creatureStorage.getAllBoids()) {
      boid.update();
    }
    for (const hunter of this.creatureStorage.getAllHunters()) {
      hunter.update();
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
    const countDisplay = document.getElementById("number-of-hunters");
    if (countDisplay) {
      countDisplay.textContent = `${count}`;
    }
  }

  private updateBoidCountDisplay(count: number) {
    const countDisplay = document.getElementById("number-of-boids");
    if (countDisplay) {
      countDisplay.textContent = `${count}`;
    }
  }
}
