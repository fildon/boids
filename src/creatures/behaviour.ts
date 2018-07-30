import { Vector2 } from "../vector2";
import { Priority } from "./priority";

export class Behaviour {
    public getIdealHeading: (() => Vector2 | null);
    public color: string;
    constructor(getIdealHeading: (() => Vector2 | null), color: string) {
        this.getIdealHeading = getIdealHeading;
        this.color = color;
    }
    public getCurrentPriority(): Priority | null {
        const currentPriority = this.getIdealHeading();
        if (currentPriority) {
            return new Priority(currentPriority, this.color);
        }
        return null;
    }
}
