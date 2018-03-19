import * as ko from "knockout";

import { Canvas } from "./canvas";
import { config } from "./config";
import { ConfigViewModel } from "./configViewModel";
import { Boid } from "./creatures/boid";
import { Creature } from "./creatures/creature";
import { Hunter } from "./creatures/hunter";
import { MouseHandler } from "./mouseHandler";

export class SimulationManager {
    public creatures: Creature[];
    private canvas: Canvas;
    private mouseHandler: MouseHandler;
    constructor() {
        this.creatures = [];
        const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        if (!canvasElement) {
            throw new Error("couldn't find 'canvas' on document");
        }
        this.canvas = new Canvas(canvasElement);
        for (let i = 0; i < config.boidQuantity; i++) {
            this.creatures.push(new Boid());
        }
        this.creatures.push(new Hunter());
        this.creatures.forEach((creature) => {
            creature.otherCreatures = this.creatures.filter((othercreature) => othercreature !== creature);
        });
        this.mouseHandler = new MouseHandler(canvasElement);
        ko.applyBindings(new ConfigViewModel());
    }

    public runSimulation(): void {
        this.tick();
    }

    public tick(): void {
        this.creatures.forEach((creature) => {
            creature.mousePosition = this.mouseHandler.mousePosition;
            creature.move();
        });
        this.canvas.draw(this.creatures);
        ((thisCaptured) => {
            setTimeout(() => {
                thisCaptured.tick();
            }, 1000 / 60);
        }) (this);
    }
}
