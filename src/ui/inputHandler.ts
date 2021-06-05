import { Vector } from "../geometry/vector";
import { config } from "../stateManagement/config";
import { Canvas } from "./canvas";

export class InputHandler {
  private canvas: Canvas;
  private createBoid: (position: Vector) => void;
  private createHunter: (position: Vector) => void;
  private separationLabel: HTMLElement;
  private alignmentLabel: HTMLElement;
  private cohesionLabel: HTMLElement;

  private left = false;
  private right = false;
  private up = false;
  private down = false;

  constructor(
    canvas: Canvas,
    createBoid: (position: Vector) => void,
    createHunter: (position: Vector) => void
  ) {
    this.canvas = canvas;
    this.createBoid = createBoid;
    this.createHunter = createHunter;
    this.separationLabel = document.getElementById("separation-status")!;
    this.alignmentLabel = document.getElementById("alignment-status")!;
    this.cohesionLabel = document.getElementById("cohesion-status")!;
    this.canvas.onclick((event: MouseEvent) => {
      this.handleMouseClick(event);
    });
    window.addEventListener("keyup", (event: KeyboardEvent) => {
      this.handleKeyUp(event);
    });
    window.addEventListener("keyup", (event) => {
      this.setArrow(event.key, false);
    });
    window.addEventListener("keydown", (event) => {
      this.setArrow(event.key, true);
    });
  }

  public handleMouseClick(event: MouseEvent): void {
    const mousePosition = this.canvas.getPositionInWorldSpace(
      new Vector(event.clientX, event.clientY)
    );
    if (event.ctrlKey || event.metaKey) {
      this.createHunter(mousePosition);
    } else {
      this.createBoid(mousePosition);
    }
  }

  public handleKeyUp(event: KeyboardEvent): void {
    const oneKey = "1";
    const twoKey = "2";
    const threeKey = "3";
    switch (event.key) {
      case oneKey:
        this.toggleSeparation();
        break;
      case twoKey:
        this.toggleAlignment();
        break;
      case threeKey:
        this.toggleCohesion();
        break;
      default:
        return;
    }
  }

  public toggleSeparation(): void {
    if (config.boid.repulsionRadius) {
      config.boid.repulsionRadius = 0;
      this.separationLabel.textContent = "OFF";
      this.separationLabel.style.color = "red";
    } else {
      config.boid.repulsionRadius = config.boid.repulsionRadiusDefault;
      this.separationLabel.textContent = "ON";
      this.separationLabel.style.color = "green";
    }
  }

  public toggleAlignment(): void {
    if (config.boid.alignmentRadius) {
      config.boid.alignmentRadius = 0;
      this.alignmentLabel.textContent = "OFF";
      this.alignmentLabel.style.color = "red";
    } else {
      config.boid.alignmentRadius = config.boid.alignmentRadiusDefault;
      this.alignmentLabel.textContent = "ON";
      this.alignmentLabel.style.color = "green";
    }
  }

  public toggleCohesion(): void {
    if (config.boid.attractionRadius) {
      config.boid.attractionRadius = 0;
      this.cohesionLabel.textContent = "OFF";
      this.cohesionLabel.style.color = "red";
    } else {
      config.boid.attractionRadius = config.boid.attractionRadiusDefault;
      this.cohesionLabel.textContent = "ON";
      this.cohesionLabel.style.color = "green";
    }
  }

  public getHeadingUpdate(): number {
    return 0.1 * (+this.right - +this.left);
  }

  public getSpeedUpdate(): number {
    return 0.5 * (+this.up - +this.down);
  }

  private setArrow(key: string, newState: boolean): void {
    switch (key) {
      case "ArrowLeft":
        this.left = newState;
        break;
      case "ArrowRight":
        this.right = newState;
        break;
      case "ArrowUp":
        this.up = newState;
        break;
      case "ArrowDown":
        this.down = newState;
        break;
      default:
        return;
    }
  }
}
