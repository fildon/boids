import { Vector } from 'geometry/vector';
import { config } from 'stateManagement/config';
import { Canvas } from './canvas';

export class InputHandler {
  private canvas: Canvas;
  private createBoid: (position: Vector) => void;
  private createHunter: (position: Vector) => void;
  private separationLabel: HTMLElement;
  private alignmentLabel: HTMLElement;
  private cohesionLabel: HTMLElement;

  constructor(
    canvas: Canvas,
    createBoid: (position: Vector) => void,
    createHunter: (position: Vector) => void,
  ) {
    this.canvas = canvas;
    this.createBoid = createBoid;
    this.createHunter = createHunter;
    this.separationLabel = document.getElementById('separation-status')!;
    this.alignmentLabel = document.getElementById('alignment-status')!;
    this.cohesionLabel = document.getElementById('cohesion-status')!;
    this.canvas.onclick((event: MouseEvent) => {
      this.handleMouseClick(event);
    });
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      this.handleKeyUp(event);
    });
  }

  public handleMouseClick(event: MouseEvent): void {
    const mousePosition = this.canvas.getPositionInWorldSpace(
      new Vector(
        event.clientX,
        event.clientY,
      ),
    );
    if (event.ctrlKey || event.metaKey) {
      this.createHunter(mousePosition);
    } else {
      this.createBoid(mousePosition);
    }
  }

  public handleKeyUp(event: KeyboardEvent): void {
    const oneKeyCode = 49;
    const twoKeyCode = 50;
    const threeKeyCode = 51;
    switch (event.keyCode) {
      case oneKeyCode: this.toggleSeparation(); break;
      case twoKeyCode: this.toggleAlignment(); break;
      case threeKeyCode: this.toggleCohesion(); break;
      default: return;
    }
  }

  public toggleSeparation(): void {
    if (config.boid.repulsionRadius) {
      config.boid.repulsionRadius = 0;
      this.separationLabel.textContent = 'OFF';
      this.separationLabel.style.color = 'red';
    } else {
      config.boid.repulsionRadius = config.boid.repulsionRadiusDefault;
      this.separationLabel.textContent = 'ON';
      this.separationLabel.style.color = 'green';
    }
  }

  public toggleAlignment(): void {
    if (config.boid.alignmentRadius) {
      config.boid.alignmentRadius = 0;
      this.alignmentLabel.textContent = 'OFF';
      this.alignmentLabel.style.color = 'red';
    } else {
      config.boid.alignmentRadius = config.boid.alignmentRadiusDefault;
      this.alignmentLabel.textContent = 'ON';
      this.alignmentLabel.style.color = 'green';
    }
  }

  public toggleCohesion(): void {
    if (config.boid.attractionRadius) {
      config.boid.attractionRadius = 0;
      this.cohesionLabel.textContent = 'OFF';
      this.cohesionLabel.style.color = 'red';
    } else {
      config.boid.attractionRadius = config.boid.attractionRadiusDefault;
      this.cohesionLabel.textContent = 'ON';
      this.cohesionLabel.style.color = 'green';
    }
  }
}
