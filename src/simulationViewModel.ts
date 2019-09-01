import * as ko from "knockout";
import { config } from "./config";
import { SimulationManager } from "./simulationManager";

export class SimulationViewModel {
    public simulationManager: SimulationManager;
    public numberOfBoids: KnockoutObservable<number>;
    public numberOfHunters: KnockoutObservable<number>;
    public createBoid: () => void;
    public createHunter: () => void;
    constructor(simulationManager: SimulationManager) {
        this.simulationManager = simulationManager;
        this.numberOfBoids = ko.observable(config.boid.quantity);
        this.numberOfHunters = ko.observable(config.hunter.quantity);
        this.createBoid = () => {
            simulationManager.createBoid();
        };
        this.createHunter = () => {
            simulationManager.createHunter();
        };
    }

    public updateBoidCount(boidsRemaining: number): void {
        this.numberOfBoids(boidsRemaining);
    }

    public updateHunterCount(hunterCount: number): void {
        this.numberOfHunters(hunterCount);
    }
}
