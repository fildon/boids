import { config } from "../stateManagement/config";

export class InputHandler {
  private left = false;
  private right = false;
  private up = false;
  private down = false;

  constructor() {
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

  public handleKeyUp(event: KeyboardEvent): void {
    const actionMap = {
      "1": this.toggleSeparation,
      "2": this.toggleAlignment,
      "3": this.toggleCohesion,
    };
    actionMap[event.key]?.();
  }

  public toggleSeparation(): void {
    if (config.boid.repulsionRadius) {
      config.boid.repulsionRadius = 0;
    } else {
      config.boid.repulsionRadius = config.boid.repulsionRadiusDefault;
    }
  }

  public toggleAlignment(): void {
    if (config.boid.alignmentRadius) {
      config.boid.alignmentRadius = 0;
    } else {
      config.boid.alignmentRadius = config.boid.alignmentRadiusDefault;
    }
  }

  public toggleCohesion(): void {
    if (config.boid.attractionRadius) {
      config.boid.attractionRadius = 0;
    } else {
      config.boid.attractionRadius = config.boid.attractionRadiusDefault;
    }
  }

  public getHeadingUpdate(): number {
    return 0.1 * (+this.right - +this.left);
  }

  public getSpeedUpdate(): number {
    return 0.5 * (+this.up - +this.down);
  }

  private setArrow(key: string, newState: boolean): void {
    const arrowMap = {
      ArrowLeft: () => (this.left = newState),
      ArrowRight: () => (this.right = newState),
      ArrowUp: () => (this.up = newState),
      ArrowDown: () => (this.down = newState),
    };
    arrowMap[key]?.();
  }
}
