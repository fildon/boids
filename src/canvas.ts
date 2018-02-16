import { Boid } from "./boid";
import { config } from "./config";

export class Canvas {
    // Where speed is 0 to 1, min to max
    public static hslString(hue: number, saturation: number, lightness: number) {
        return "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)";
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
        this.canvas.width = config.maxX;
        this.canvas.height = config.maxY;
        this.speedRange = config.maxSpeed - config.minSpeed;
    }

    public draw(boids: Boid[]): void {
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (window) {
            config.maxX = window.innerWidth * 0.9;
            config.maxY = window.innerHeight * 0.9;
        }
        if (Math.abs(this.ctx.canvas.width - config.maxX) > 1) {
            this.ctx.canvas.width = config.maxX;
        }
        if (Math.abs(this.ctx.canvas.height - config.maxY) > 1) {
            this.ctx.canvas.height = config.maxY;
        }
        boids.forEach((boid) => {
            this.drawBoid(boid);
        });
    }

    public drawBoid(boid: Boid): void {
        this.drawBoidBody(boid);
        this.drawBoidBeak(boid);
    }

    public drawBoidBody(boid: Boid): void {
        const speedProportion = (boid.velocity.length() - config.minSpeed) / this.speedRange;
        const hue = 360 * speedProportion;
        this.drawFadingCircle(boid.position.x, boid.position.y, 4, hue, 50);
    }

    public drawBoidBeak(boid: Boid): void {
        const speedProportion = 0.25 + (boid.velocity.length() - config.minSpeed) / (2 * this.speedRange);
        this.drawFadingCircle(
            boid.position.x + speedProportion * boid.velocity.x,
            boid.position.y + speedProportion * boid.velocity.y,
            2);
    }

    public drawFadingCircle(x: number, y: number, radius: number, hue?: number, lightness?: number) {
        const fadeTicks = 10;
        const ctx = this.ctx;
        let i = 0;
        const lightnessDelta = hue ? 50 / fadeTicks : 100 / fadeTicks;
        const hueOrBlack = hue ? hue : 0;
        const saturation = hue ? 50 : 0;
        const interval = setInterval(() => {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = Canvas.hslString(hueOrBlack, saturation, 50 + i * lightnessDelta);
            ctx.fill();
            ctx.strokeStyle = Canvas.hslString(hueOrBlack, saturation, 50 + i * lightnessDelta);
            ctx.stroke();
            i++;
            if (i === fadeTicks) {
                clearInterval(interval);
            }
        }, 1000 / config.tickRate);
    }
}
