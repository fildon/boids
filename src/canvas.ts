import { config } from "./config";
import { Creature } from "./creatures/creature";
import { Vector2 } from "./vector2";

export class Canvas {
    private frameCount: number;
    private cameraPosition: Vector2;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvasElement: HTMLCanvasElement) {
        this.frameCount = 0;
        this.cameraPosition = new Vector2(window.innerWidth, window.innerHeight);
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

    public onclick(callback: ((ev: MouseEvent) =>  any)) {
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
        cameraPosition: Vector2,
    ): void {
        this.frameCount++;
        this.cameraPosition = cameraPosition;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.setScreenSize();
        this.drawRipples();
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

    public getPositionInCameraSpace(position: Vector2): Vector2 {
        return position
            .add(new Vector2(window.innerWidth / 2, window.innerHeight / 2))
            .subtract(this.cameraPosition)
            .normalize();
    }

    public getPositionInWorldSpace(position: Vector2): Vector2 {
        return position
            .subtract(new Vector2(window.innerWidth / 2, window.innerHeight / 2))
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
        this.ctx.fillStyle = "black";
        this.ctx.fill();
    }

    public drawRipples(): void {
        const palette = [
            'rgba(214, 245, 245, 0.8)',
            'rgba(51, 204, 204, 0.8)',
            'rgba(20, 82, 82, 0.8)',
            'rgba(51, 204, 204, 0.8)',
        ];
        const ripple = this.ctx.createLinearGradient(
            0, 0,
            this.canvas.width, 0
        );
        const wavelength = 200;
        const rippleLength = this.canvas.width;
        const gradientStep = wavelength / rippleLength;
        const frameStep = this.frameCount / rippleLength;

        let rippleOffset = 0;
        while(rippleOffset * wavelength < this.canvas.width) {
            ripple.addColorStop(
                (gradientStep * rippleOffset + frameStep) % 1,
                palette[rippleOffset % palette.length]
            );
            rippleOffset++;
        }
        this.ctx.fillStyle = ripple
        this.ctx.fillRect(
            0, 0,
            this.canvas.width,
            this.canvas.height
        )
    }
}
