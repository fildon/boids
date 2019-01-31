import * as ko from "knockout";

import { Canvas } from "./canvas";
import { config } from "./config";
import { SimulationViewModel } from "./simulationViewModel";
import { CreatureStorage } from "./creatureStorage";
import { Vector2 } from "./vector2";

export class SimulationManager {
    private canvas: Canvas;
    private creatureStorage: CreatureStorage;
    private simulationViewModel: SimulationViewModel;
    constructor() {
        this.canvas = new Canvas();
        this.creatureStorage = new CreatureStorage(this.canvas);
        this.simulationViewModel = new SimulationViewModel(this);
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
        requestAnimationFrame(() => this.tick());
        this.canvas.render();
        this.creatureStorage.update();
        for (const boid of this.creatureStorage.getAllBoids()) {
            boid.update();
        }
        for (const hunter of this.creatureStorage.getAllHunters()) {
            hunter.update();
        }
        this.simulationViewModel.updateHunterCount(
            this.creatureStorage.getHunterCount(),
        );
        this.simulationViewModel.updateBoidCount(
            this.creatureStorage.getBoidCount(),
        );
    }
}
