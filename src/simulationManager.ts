import * as ko from "knockout";

import { Boid } from "./boid";
import { Canvas } from "./canvas";
import { config } from "./config";
import { ConfigViewModel } from "./configViewModel";
import { MouseHandler } from "./mouseHandler";

export class SimulationManager {
    public boids: Boid[];
    private canvas: Canvas;
    private mouseHandler: MouseHandler;
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
        this.mouseHandler = new MouseHandler(canvasElement);
        ko.applyBindings(new ConfigViewModel());
    }

    public runSimulation(): void {
        this.tick();
    }

    public tick(): void {
        this.boids.forEach((boid) => {
            boid.mousePosition = this.mouseHandler.mousePosition;
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
