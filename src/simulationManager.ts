import * as ko from "knockout";

import { Canvas } from "./canvas";
import { config } from "./config";
import { ConfigViewModel } from "./configViewModel";
import { Boid } from "./creatures/boid";
import { Creature } from "./creatures/creature";
import { Hunter } from "./creatures/hunter";
import { MouseHandler } from "./mouseHandler";

export class SimulationManager {
    public creatures: Map<number, Creature>;
    private canvas: Canvas;
    private mouseHandler: MouseHandler;
    constructor() {
        this.creatures = new Map();
        const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        if (!canvasElement) {
            throw new Error("couldn't find 'canvas' on document");
        }
        this.canvas = new Canvas(canvasElement);

        for (let i = 0; i < config.boidQuantity; i++) {
            this.creatures.set(this.creatures.size, new Boid(this.creatures.size, this.creatures));
        }
        this.creatures.set(this.creatures.size, new Hunter(this.creatures.size, this.creatures));

        this.mouseHandler = new MouseHandler(canvasElement);
        ko.applyBindings(new ConfigViewModel());
    }

    public runSimulation(): void {
        this.tick();
    }

    public tick(): void {
        this.creatures.forEach((creature) => {
            creature.mousePosition = this.mouseHandler.mousePosition;
            creature.update();
        });
        this.canvas.draw([...this.creatures.values()]);
        ((thisCaptured) => {
            setTimeout(() => {
                thisCaptured.tick();
            }, 1000 / 60);
        }) (this);
    }
}
