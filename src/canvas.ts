import { config } from "./config";
import { Creature } from "./creatures/creature";

export class Canvas {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvasElement: HTMLCanvasElement) {
        this.canvas = canvasElement;
        const context = this.canvas.getContext("2d");
        if (!context) {
            throw new Error("could not get canvas context");
        } else {
            this.ctx = context;
        }
        this.canvas.height = config.screen.maxY;
        this.canvas.width = config.screen.maxX;

        this.setScreenSize();
    }

    public setScreenSize(): void {
        if (window) {
            config.screen.maxX = window.innerWidth * 0.9;
            config.screen.maxY = window.innerHeight * 0.9;
        }
        this.ctx.canvas.width = config.screen.maxX;
        this.ctx.canvas.height = config.screen.maxY;
    }

    public draw(creatures: Creature[]): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.setScreenSize();
        this.drawGhosts(creatures);
        creatures.forEach((creature) => {
            this.drawCreature(creature);
        });
    }

    public drawGhosts(creatures: Creature[]) {
        if (!config.creature.maxHistory) {
            return;
        }
        for (let i = 0; i < config.creature.maxHistory; i++) {
            creatures.forEach((creature) => {
                this.drawGhost(creature, i);
            });
        }
    }

    public drawGhost(creature: Creature, historyIndex: number) {
        this.drawCreatureBody(creature, historyIndex);
    }

    public drawCreature(creature: Creature): void {
        this.drawCreatureBody(creature);
        this.drawCreatureBeak(creature);
    }

    public drawCreatureBody(creature: Creature, historyIndex?: number): void {
        const position = historyIndex ? creature.history[historyIndex] : creature.position;
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
        const heading = creature.velocity.unitVector();
        this.ctx.beginPath();
        this.ctx.arc(
            creature.position.x + (creature.size + 1) * heading.x,
            creature.position.y + (creature.size + 1) * heading.y,
            creature.size / 2, 0, 2 * Math.PI);
        this.ctx.fillStyle = "black";
        this.ctx.fill();
    }
}
