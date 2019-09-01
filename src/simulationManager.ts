import * as ko from "knockout";

import { Canvas } from "./canvas";
import { config } from "./config";
import { InputHandler } from "./inputHandler";
import { SimulationViewModel } from "./simulationViewModel";
import { CreatureStorage } from "./creatureStorage";
import { Vector2 } from "./vector2";
import PlayerFish from "./creatures/playerFish";

export class SimulationManager {
    private canvas: Canvas;
    private simulationViewModel: SimulationViewModel;
    private inputHandler: InputHandler;
    private creatureStorage: CreatureStorage;
    private playerFish: PlayerFish;
    constructor() {
        const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        if (!canvasElement) {
            throw new Error("couldn't find 'canvas' on document");
        }
        this.canvas = new Canvas(canvasElement);
        this.simulationViewModel = new SimulationViewModel();
        this.inputHandler = new InputHandler(
            this.canvas,
            (position: Vector2) => this.createBoid(position),
            (position: Vector2) => this.createHunter(position),
        );
        ko.applyBindings(this.simulationViewModel);

        this.creatureStorage = new CreatureStorage(this.inputHandler);
        for (let i = 0; i < config.boid.quantity; i++) {
            this.creatureStorage.addBoid();
        }
        for (let i = 0; i < config.hunter.quantity; i++) {
            this.creatureStorage.addHunter();
        }
        this.playerFish = this.creatureStorage.addPlayerFish();
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
            boid.update();
        }
        for (const hunter of this.creatureStorage.getAllHunters()) {
            hunter.update();
        }
        this.playerFish.update();
        this.canvas.draw(
            this.creatureStorage.getAllCreatures(),
            this.playerFish.position,
        );
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
