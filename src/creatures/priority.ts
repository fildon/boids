import { Vector2 } from "../vector2";

export class Priority {
    public idealHeading: (() => Vector2);
    public color: string;
    constructor(idealHeading: (() => Vector2), color: string) {
        this.idealHeading = idealHeading;
        this.color = color;
    }
}
