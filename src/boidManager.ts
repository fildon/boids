import { Boid } from "./boid";
import { Canvas } from "./canvas";
import { config } from "./config";

export class BoidManager {
    public boids: Boid[];
    private canvas: Canvas;
    constructor() {
        this.boids = [];
        const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        if (!canvasElement) {
            throw new Error("couldn't find 'canvas' on document");
        }
        this.canvas = new Canvas(canvasElement);
        for (let i = 0; i < config.boidQuantity; i++) {
            this.boids.push(new Boid());
        }
        this.boids.forEach((boid) => {
            boid.otherBoids = this.boids.filter((otherboid) => otherboid !== boid);
        });
    }

    public runSimulation(): void {
        this.tick();
    }

    public tick(): void {
        this.boids.forEach((boid) => {
            boid.move();
        });
        this.canvas.draw(this.boids);
        ((thisCaptured) => {
            setTimeout(() => {
                thisCaptured.tick();
            }, 1000 / 60);
        }) (this);
    }
}
