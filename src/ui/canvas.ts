import { config } from '../stateManagement/config';
import { Creature } from '../creatures/creature';
import { Vector } from '../geometry/vector';
import { FpsCounter } from './fpsCounter';

export class Canvas {
  private readonly fpsCounter: FpsCounter;
  private cameraPosition: Vector;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvasElement: HTMLCanvasElement) {
    this.fpsCounter = FpsCounter.getFpsCounter();
    this.cameraPosition = new Vector(window.innerWidth, window.innerHeight);
    this.canvas = canvasElement;
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('could not get canvas context');
    } else {
      this.ctx = context;
    }
    this.canvas.height = config.screen.maxY;
    this.canvas.width = config.screen.maxX;

    this.setScreenSize();
  }

  public onclick(callback: ((ev: MouseEvent) => void)): void {
    this.canvas.onclick = callback;
  }

  public setScreenSize(): void {
    if (window) {
      config.screen.maxX = window.innerWidth;
      config.screen.maxY = window.innerHeight;
    }
    this.ctx.canvas.width = config.screen.maxX;
    this.ctx.canvas.height = config.screen.maxY;
  }

  public draw(
    creatures: Creature[],
    cameraPosition: Vector = new Vector(window.innerWidth / 2, window.innerHeight / 2),
  ): void {
    this.cameraPosition = cameraPosition;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.setScreenSize();
    this.drawGhosts(creatures);
    creatures.forEach((creature) => {
      this.drawCreature(creature);
    });

    this.fpsCounter.countFrame();
    this.fpsCounter.updateFps();
  }

  public drawGhosts(creatures: Creature[]): void {
    if (!config.creature.maxHistory) {
      return;
    }
    for (let i = 0; i < config.creature.maxHistory; i++) {
      creatures.forEach((creature) => {
        this.drawGhost(creature, i);
      });
    }
  }

  public drawGhost(creature: Creature, historyIndex: number): void {
    this.drawCreatureBody(creature, historyIndex);
  }

  public drawCreature(creature: Creature): void {
    this.drawCreatureBody(creature);
    this.drawCreatureBeak(creature);
  }

  public getPositionInCameraSpace(position: Vector): Vector {
    return position
      .add(new Vector(window.innerWidth / 2, window.innerHeight / 2))
      .subtract(this.cameraPosition)
      .normalize();
  }

  public getPositionInWorldSpace(position: Vector): Vector {
    return position
      .subtract(new Vector(window.innerWidth / 2, window.innerHeight / 2))
      .add(this.cameraPosition)
      .normalize();
  }

  public drawCreatureBody(creature: Creature, historyIndex?: number): void {
    let position = historyIndex ? creature.history[historyIndex] : creature.position;
    position = this.getPositionInCameraSpace(position);
    const radius = historyIndex ?
      creature.size * ((historyIndex + 1) / (config.creature.maxHistory + 1)) :
      creature.size;
    this.ctx.beginPath();
    this.ctx.arc(
      position.x,
      position.y,
      radius,
      0, 2 * Math.PI);
    this.ctx.fillStyle = creature.colour;
    this.ctx.fill();
  }

  public drawCreatureBeak(creature: Creature): void {
    const position = this.getPositionInCameraSpace(creature.position);
    this.ctx.beginPath();
    this.ctx.arc(
      position.x + (creature.size + 1) * Math.cos(creature.heading),
      position.y + (creature.size + 1) * Math.sin(creature.heading),
      creature.size / 2, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'black';
    this.ctx.fill();
  }
}
