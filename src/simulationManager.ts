import * as ko from "knockout";

import { Canvas } from "./canvas";
import { config } from "./config";
import { InputHandler } from "./inputHandler";
import { SimulationViewModel } from "./simulationViewModel";
import { CreatureStorage } from "./creatureStorage";
import { Vector2 } from "./vector2";

export class SimulationManager {
    private creatureStorage = new CreatureStorage();
    private canvas: Canvas;
    private mouseHandler: InputHandler;
    private simulationViewModel: SimulationViewModel;
    constructor() {
        const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        if (!canvasElement) {
            throw new Error("couldn't find 'canvas' on document");
        }
        this.canvas = new Canvas(canvasElement);
        this.simulationViewModel = new SimulationViewModel(this);
        this.mouseHandler = new InputHandler(
            canvasElement,
            (position: Vector2) => this.createBoid(position),
            (position: Vector2) => this.createHunter(position),
        );
        ko.applyBindings(this.simulationViewModel);

        for (let i = 0; i < config.boid.quantity; i++) {
            this.creatureStorage.addBoid();
        }
        for (let i = 0; i < config.hunter.quantity; i++) {
            this.creatureStorage.addHunter();
        }
    }

    public createBoid(position?: Vector2) {
        this.creatureStorage.addBoid(position);
    }

    public createHunter(position?: Vector2) {
        this.creatureStorage.addHunter(position);
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
