import * as ko from "knockout";
import { config } from "./config";

export class ConfigViewModel {
    public mouseRadius: KnockoutObservable<number>;
    public turningMax: KnockoutObservable<number>;
    public numberOfBoids: KnockoutObservable<number>;
    public numberOfHunters: KnockoutObservable<number>;
    constructor() {
        this.mouseRadius = ko.observable(config.mouseRadius);
        this.mouseRadius.subscribe((newValue) => {
            config.mouseRadius = newValue;
        });
        this.turningMax = ko.observable(config.turningMax);
        this.turningMax.subscribe((newValue) => {
            config.turningMax = newValue;
        });
        this.numberOfBoids = ko.observable(config.boidQuantity);
        this.numberOfHunters = ko.observable(config.hunterQuantity);
    }

    public updateBoidCount(boidsRemaining: number): void {
        this.numberOfBoids(boidsRemaining);
    }
}
