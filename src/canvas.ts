import { config } from "./config";
import { Creature } from "./creatures/creature";
import { Vector2 } from "./vector2";

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
        this.canvas.height = config.maxY;
        this.canvas.width = config.maxX;

        this.setScreenSize();
    }

    public setScreenSize(): void {
        if (window) {
            config.maxX = window.innerWidth * 0.9;
            config.maxY = window.innerHeight * 0.9;
        }
        this.ctx.canvas.width = config.maxX;
        this.ctx.canvas.height = config.maxY;
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
        if (!config.maxHistory) {
            return;
        }
        for (let i = 0; i < config.maxHistory; i++) {
            this.ctx.globalAlpha = (i + 1) / config.maxHistory;
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
            4 * (historyIndex / config.maxHistory) :
            4;
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
        this.ctx.beginPath();
        this.ctx.arc(
            creature.position.x + 0.9 * creature.velocity.x,
            creature.position.y + 0.9 * creature.velocity.y,
            2, 0, 2 * Math.PI);
        this.ctx.fillStyle = "black";
        this.ctx.fill();
    }
}
