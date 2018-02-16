import { Boid } from "./boid";
import { config } from "./config";

export class Canvas {
    // Where speed is 0 to 1, min to max
    public static colorFromSpeed(speed: number) {
        return "hsl(" + (speed * 360) + ", 50%, 50%)";
    }

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private speedRange: number;

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
    }

    public draw(boids: Boid[]): void {
        this.ctx.clearRect(0, 0, config.maxX, config.maxY);
        boids.forEach((boid) => {
            this.drawBoid(boid);
        });
    }

    public drawBoid(boid: Boid): void {
        this.drawBoidBody(boid);
        this.drawBoidBeak(boid);
    }

    public drawBoidBody(boid: Boid): void {
        this.ctx.beginPath();
        const speedProportion = (boid.velocity.length() - config.minSpeed) / this.speedRange;
        const colour = Canvas.colorFromSpeed(speedProportion);
        this.ctx.arc(
            boid.position.x,
            boid.position.y,
            4, 0, 2 * Math.PI);
        this.ctx.fillStyle = colour;
        this.ctx.fill();
        this.ctx.strokeStyle = colour;
        this.ctx.stroke();
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
        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
    }
}
