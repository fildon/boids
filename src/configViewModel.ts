import * as ko from "knockout";
import { config } from "./config";

export class ConfigViewModel {
    public mouseRadius: KnockoutObservable<number>;
    constructor() {
        this.mouseRadius = ko.observable(config.mouseRadius);
        this.mouseRadius.subscribe((newValue) => {
            config.mouseRadius = newValue;
        });
    }
}
