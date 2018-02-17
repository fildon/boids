import { Boid } from "./boid";
import { config } from "./config";
import { Vector2 } from "./vector2";

export class Canvas {
    // Where speed is 0 to 1, min to max
    public static colorFromSpeed(speed: number) {
        return "hsl(" + (speed * 360) + ", 50%, 50%)";
    }

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private speedRange: number;
    private mousePosition: Vector2;

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
        this.speedRange = config.maxSpeed - config.minSpeed;
        this.mousePosition = new Vector2(-1, -1);
        this.canvas.onmousemove = (event: MouseEvent) => {
            this.handleMouseMove(event, this.canvas);
        };
        this.canvas.onmouseout = () => { this.handleMouseOut(); };
    }

    public handleMouseMove(event: MouseEvent, canvas: HTMLCanvasElement) {
        const rect = canvas.getBoundingClientRect();
        this.mousePosition = new Vector2(
            event.clientX - rect.left,
            event.clientY - rect.top,
        );
    }

    public handleMouseOut() {
        this.mousePosition = new Vector2(-1, -1);
    }

    public draw(boids: Boid[]): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (window) {
            config.maxX = window.innerWidth * 0.9;
            config.maxY = window.innerHeight * 0.9;
        }
        this.ctx.canvas.width = config.maxX;
        this.ctx.canvas.height = config.maxY;
        this.drawGhosts(boids);
        boids.forEach((boid) => {
            this.drawBoid(boid);
        });
    }

    public drawGhosts(boids: Boid[]) {
        if (!config.maxHistory) {
            return;
        }
        for (let i = 0; i < config.maxHistory; i++) {
            this.ctx.globalAlpha = (i + 1) / config.maxHistory;
            boids.forEach((boid) => {
                this.drawGhost(boid, i);
            });
        }
    }

    public drawGhost(boid: Boid, historyIndex: number) {
        this.drawBoidBody(boid, historyIndex);
    }

    public drawBoid(boid: Boid): void {
        this.drawBoidBody(boid);
        this.drawBoidBeak(boid);
    }

    public drawBoidBody(boid: Boid, historyIndex?: number): void {
        const position = historyIndex ? boid.history[historyIndex] : boid.position;
        const radius = historyIndex ?
            4 * (historyIndex / config.maxHistory) :
            4;
        this.ctx.beginPath();
        const speedProportion = (boid.velocity.length() - config.minSpeed) / this.speedRange;
        const colour = Canvas.colorFromSpeed(speedProportion);
        this.ctx.arc(
            position.x,
            position.y,
            radius,
            0, 2 * Math.PI);
        this.ctx.fillStyle = colour;
        this.ctx.fill();
    }

    public drawBoidBeak(boid: Boid): void {
        const speedProportion = 0.25 + (boid.velocity.length() - config.minSpeed) / (2 * this.speedRange);
        this.ctx.beginPath();
        this.ctx.arc(
            boid.position.x + speedProportion * boid.velocity.x,
            boid.position.y + speedProportion * boid.velocity.y,
            2, 0, 2 * Math.PI);
        this.ctx.fillStyle = "black";
        this.ctx.fill();
    }
}
