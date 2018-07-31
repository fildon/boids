import * as ko from "knockout";

import { Canvas } from "./canvas";
import { config } from "./config";
import { Boid } from "./creatures/boid";
import { Creature } from "./creatures/creature";
import { Hunter } from "./creatures/hunter";
import { MouseHandler } from "./mouseHandler";
import { SimulationViewModel } from "./simulationViewModel";

export class SimulationManager {
    public creatures: Map<number, Creature>;
    private canvas: Canvas;
    private mouseHandler: MouseHandler;
    private simulationViewModel: SimulationViewModel;
    constructor() {
        this.creatures = new Map();
        const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        if (!canvasElement) {
            throw new Error("couldn't find 'canvas' on document");
        }
        this.canvas = new Canvas(canvasElement);

        for (let i = 0; i < config.boid.quantity; i++) {
            this.createBoid();
        }
        for (let i = 0; i < config.hunter.quantity; i++) {
            this.createHunter();
        }

        this.mouseHandler = new MouseHandler(canvasElement);

        this.simulationViewModel = new SimulationViewModel();
        ko.applyBindings(this.simulationViewModel);
    }

    public createBoid(): void {
        this.creatures.set(this.creatures.size, new Boid(
            this.creatures.size,
            this.creatures,
        ));
    }

    public createHunter(): void {
        this.creatures.set(this.creatures.size, new Hunter(
            this.creatures.size,
            this.creatures,
            () => this.updateBoidCount(),
        ));
    }

    public updateBoidCount(): void {
        this.simulationViewModel.updateBoidCount(
            this.creatures.size - config.hunter.quantity,
        );
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
