import { Boid } from "./boid";
import { Canvas } from "./canvas";

export class BoidManager {
    public boids: Boid[];
    private canvas: Canvas;
    constructor(boidQuantity: number) {
        this.boids = [];
        const canvasElement = document.getElementById("canvas");
        if (!canvasElement) {
            throw new Error("couldn't find 'canvas' on document");
        }
        this.canvas = new Canvas(canvasElement);
        for (let i = 0; i < boidQuantity; i++) {
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
        this.canvas.update(this.boids);
        ((thisCaptured) => {
            setTimeout(() => {
                thisCaptured.tick();
            }, 1000 / 24);
        }) (this);
    }
}
