import { Vector2 } from "../vector2";

export class Priority {
    public idealHeading: Vector2;
    public color: number;
    constructor(idealHeading: Vector2, color: number) {
        this.idealHeading = idealHeading;
        this.color = color;
    }
}
