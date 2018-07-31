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
    public nextCreatureId: number;
    private canvas: Canvas;
    private mouseHandler: MouseHandler;
    private simulationViewModel: SimulationViewModel;
    constructor() {
        this.creatures = new Map();
        this.nextCreatureId = 0;
        const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        if (!canvasElement) {
            throw new Error("couldn't find 'canvas' on document");
        }
        this.canvas = new Canvas(canvasElement);
        this.simulationViewModel = new SimulationViewModel(this);
        this.mouseHandler = new MouseHandler(canvasElement);
        ko.applyBindings(this.simulationViewModel);

        for (let i = 0; i < config.boid.quantity; i++) {
            this.createBoid();
        }
        for (let i = 0; i < config.hunter.quantity; i++) {
            this.createHunter();
        }
    }

    public createBoid(): void {
        this.creatures.set(this.nextCreatureId, new Boid(
            this.nextCreatureId,
            this.creatures,
        ));
        this.nextCreatureId++;
        this.updateBoidCount();
    }

    public createHunter(): void {
        this.creatures.set(this.nextCreatureId, new Hunter(
            this.nextCreatureId,
            this.creatures,
            () => this.updateBoidCount(),
        ));
        this.nextCreatureId++;
        this.updateHunterCount();
    }

    public updateBoidCount(): void {
        let boidCount = 0;
        this.creatures.forEach((creature) => {
            if (creature instanceof Boid) {
                boidCount++;
            }
        });
        this.simulationViewModel.updateBoidCount(
            boidCount,
        );
    }

    public updateHunterCount(): void {
        let huntercount = 0;
        this.creatures.forEach((creature) => {
            if (creature instanceof Hunter) {
                huntercount++;
            }
        });
        this.simulationViewModel.updateHunterCount(
            huntercount,
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
