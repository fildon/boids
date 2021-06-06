import { Canvas } from "../ui/canvas";
import { config } from "./config";
import { CreatureStorage } from "./creatureStorage";
import PlayerFish from "../creatures/playerFish";

export class SimulationManager {
  private canvas: Canvas;
  private creatureStorage: CreatureStorage;
  private readonly fpsTarget = 60;
  private playerFish: PlayerFish;
  constructor() {
    const canvasElement = document.getElementById(
      "canvas"
    ) as HTMLCanvasElement;
    if (!canvasElement) {
      throw new Error("couldn't find 'canvas' on document");
    }
    this.canvas = new Canvas(canvasElement);

    this.creatureStorage = new CreatureStorage();
    for (let i = 0; i < config.boid.quantity; i++) {
      this.creatureStorage.addBoid();
    }
    for (let i = 0; i < config.hunter.quantity; i++) {
      this.creatureStorage.addHunter();
    }
    this.playerFish = this.creatureStorage.addPlayerFish();
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
    for (const hunter of this.creatureStorage.getAllHunters()) {
      hunter.update();
    }
    this.playerFish.update();
  }

  public renderSimulation(): void {
    this.canvas.draw(
      this.creatureStorage.getAllCreatures(),
      this.playerFish.position
    );
  }
}
