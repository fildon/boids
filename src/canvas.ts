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
        const getColourFromAngle = (theta: number) => {
            return `hsla(170, 60%, ${50 + 20 * Math.sin(theta)}%, .2)`
        }
        const ripples = [
            {
                gradient: this.ctx.createLinearGradient(
                    0, this.canvas.height / 2,
                    this.canvas.width, 0
                ),
                wavelength: 0.02,
                speed: 0.002
            },
            {
                gradient: this.ctx.createLinearGradient(
                    this.canvas.width, 0,
                    0, this.canvas.height / 3
                ),
                wavelength: 0.07,
                speed: 0.008
            },
            {
                gradient: this.ctx.createLinearGradient(
                    this.canvas.width / 3, 0,
                    0, this.canvas.height
                ),
                wavelength: 0.02,
                speed: 0.002
            },
            {
                gradient: this.ctx.createLinearGradient(
                    0, this.canvas.height,
                    this.canvas.width / 7, 0
                ),
                wavelength: 0.07,
                speed: 0.006
            }
        ]

        ripples.forEach(ripple => {
            let rippleOffset = 0;
            while(ripple.wavelength * rippleOffset < 1) {
                ripple.gradient.addColorStop(
                    (ripple.wavelength * rippleOffset + ripple.speed * this.frameCount) % 1,
                    getColourFromAngle(rippleOffset)
                );
                rippleOffset++;
            }
        })


        ripples.forEach(ripple => {
            this.ctx.fillStyle = ripple.gradient
            this.ctx.fillRect(
                0, 0,
                this.canvas.width,
                this.canvas.height
            )
        })
    }
}
