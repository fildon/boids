import { Vector2 } from "../vector2";
import { Priority } from "./priority";

export class Behaviour {
    public getIdealHeading: (() => Vector2 | null);
    public getColor: (() => string);
    constructor(getIdealHeading: (() => Vector2 | null), getColor: () => string) {
        this.getIdealHeading = getIdealHeading;
        this.getColor = getColor;
    }
    public getCurrentPriority(): Priority | null {
        const currentPriority = this.getIdealHeading();
        if (currentPriority) {
            return new Priority(currentPriority, this.getColor());
        }
        return null;
    }
}
