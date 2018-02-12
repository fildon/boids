export class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public distance(v: Vector2) {
        return Math.sqrt((v.x - this.x)^2 + (v.y - this.y)^2);
    }
}
