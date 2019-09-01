import * as ko from "knockout";
import { config } from "./config";

export class SimulationViewModel {
    public numberOfBoids: KnockoutObservable<number>;
    public numberOfHunters: KnockoutObservable<number>;
    constructor() {
        this.numberOfBoids = ko.observable(config.boid.quantity);
        this.numberOfHunters = ko.observable(config.hunter.quantity);
    }

    public updateBoidCount(boidsRemaining: number): void {
        this.numberOfBoids(boidsRemaining);
    }

    public updateHunterCount(hunterCount: number): void {
        this.numberOfHunters(hunterCount);
    }
}
