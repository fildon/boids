import * as ko from "knockout";

import { Canvas } from "./canvas";
import { config } from "./config";
import { MouseHandler } from "./mouseHandler";
import { SimulationViewModel } from "./simulationViewModel";
import { CreatureStorage } from "./creatureStorage";

export class SimulationManager {
    private creatureStorage = new CreatureStorage();
    private canvas: Canvas;
    private mouseHandler: MouseHandler;
    private simulationViewModel: SimulationViewModel;
    constructor() {
        const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        if (!canvasElement) {
            throw new Error("couldn't find 'canvas' on document");
        }
        this.canvas = new Canvas(canvasElement);
        this.simulationViewModel = new SimulationViewModel(this);
        this.mouseHandler = new MouseHandler(
            canvasElement,
            () => this.createBoid(),
            () => this.createHunter(),
        );
        ko.applyBindings(this.simulationViewModel);

        for (let i = 0; i < config.boid.quantity; i++) {
            this.creatureStorage.addBoid();
        }
        for (let i = 0; i < config.hunter.quantity; i++) {
            this.creatureStorage.addHunter();
        }
    }

    public createBoid() {
        this.creatureStorage.addBoid();
    }

    public createHunter() {
        this.creatureStorage.addHunter();
    }

    public runSimulation(): void {
        this.tick();
    }

    public tick(): void {
        this.creatureStorage.update();
        for (const boid of this.creatureStorage.getAllBoids()) {
            boid.mousePosition = this.mouseHandler.mousePosition;
            boid.update();
        }
        for (const hunter of this.creatureStorage.getAllHunters()) {
            hunter.update();
        }
        this.canvas.draw(this.creatureStorage.getAllCreatures());
        this.simulationViewModel.updateHunterCount(
            this.creatureStorage.getHunterCount(),
        );
        this.simulationViewModel.updateBoidCount(
            this.creatureStorage.getBoidCount(),
        );
        ((thisCaptured) => {
            setTimeout(() => {
                thisCaptured.tick();
            }, 1000 / 60);
        }) (this);
    }
}
