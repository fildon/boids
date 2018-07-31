import * as ko from "knockout";
import { config } from "./config";

export class SimulationViewModel {
    public mouseRadius: KnockoutObservable<number>;
    public turningMax: KnockoutObservable<number>;
    public numberOfBoids: KnockoutObservable<number>;
    public numberOfHunters: KnockoutObservable<number>;
    constructor() {
        this.mouseRadius = ko.observable(config.boid.mouseAvoidRadius);
        this.mouseRadius.subscribe((newValue) => {
            config.boid.mouseAvoidRadius = newValue;
        });
        this.turningMax = ko.observable(config.creature.turningMax);
        this.turningMax.subscribe((newValue) => {
            config.creature.turningMax = newValue;
        });
        this.numberOfBoids = ko.observable(config.boid.quantity);
        this.numberOfHunters = ko.observable(config.hunter.quantity);
    }

    public updateBoidCount(boidsRemaining: number): void {
        this.numberOfBoids(boidsRemaining);
    }
}
