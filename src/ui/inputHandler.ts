import { config } from "../stateManagement/config";

function toggleSeparation(): void {
  if (config.boid.repulsionRadius) {
    config.boid.repulsionRadius = 0;
  } else {
    config.boid.repulsionRadius = config.boid.repulsionRadiusDefault;
  }
}

function toggleAlignment(): void {
  if (config.boid.alignmentRadius) {
    config.boid.alignmentRadius = 0;
  } else {
    config.boid.alignmentRadius = config.boid.alignmentRadiusDefault;
  }
}

function toggleCohesion(): void {
  if (config.boid.attractionRadius) {
    config.boid.attractionRadius = 0;
  } else {
    config.boid.attractionRadius = config.boid.attractionRadiusDefault;
  }
}

function handleKeyUp(event: KeyboardEvent): void {
  const actionMap = {
    "1": toggleSeparation,
    "2": toggleAlignment,
    "3": toggleCohesion,
  };
  actionMap[event.key]?.();
}
export class InputHandler {
  private left = false;
  private right = false;
  private up = false;
  private down = false;

  constructor() {
    window.addEventListener("keyup", handleKeyUp);

    window.addEventListener("touchend", () => {
      this.left = false;
      this.right = false;
    });
    window.addEventListener("mouseup", () => {
      this.left = false;
      this.right = false;
    });
    window.addEventListener("keyup", (event) => {
      this.setArrow(event.key, false);
    });

    window.addEventListener("touchstart", (event) =>
      this.handleTouchSteering(event)
    );
    window.addEventListener("mousedown", (event) =>
      this.handleMouseSteering(event)
    );
    window.addEventListener("keydown", (event) => {
      this.setArrow(event.key, true);
    });
  }

  public getHeadingUpdate(): number {
    return 0.1 * (+this.right - +this.left);
  }

  public getSpeedUpdate(): number {
    return 0.5 * (+this.up - +this.down);
  }

  private handleTouchSteering(event: TouchEvent): void {
    let allRight = true;
    let allLeft = true;
    for (let i = 0; i < event.touches.length; i++) {
      event.touches.item(i).clientX < window.innerWidth / 2
        ? (allRight = false)
        : (allLeft = false);
    }
    this.left = allLeft;
    this.right = allRight;
  }

  private handleMouseSteering(event: MouseEvent): void {
    if (event.clientX < window.innerWidth / 2) {
      this.left = true;
      return;
    }
    this.right = true;
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
