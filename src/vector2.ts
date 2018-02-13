export class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public distance(v: Vector2): number {
        return Math.sqrt(Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2));
    }

    public vectorTo(vector: Vector2): Vector2 {
        return new Vector2(vector.x - this.x, vector.y - this.y);
    }

    public rotate(radians: number): void {
        var xcopy = this.x;
        var ycopy = this.y;
        this.x = xcopy * Math.cos(radians) - ycopy * Math.sin(radians);
        this.y = xcopy * Math.sin(radians) + ycopy * Math.cos(radians);
    }

    public rotateAwayFrom(vector: Vector2, angle: number): void {
        var relativeAngleFromVectorToThis = Math.atan2(
            vector.x * this.y - vector.y * this.x,
            vector.x * this.x + vector.y * this.y
        );
        if (relativeAngleFromVectorToThis > 0) {
            this.rotate(Math.min(Math.PI - relativeAngleFromVectorToThis, angle));
        } else {
            this.rotate(Math.max(-relativeAngleFromVectorToThis - Math.PI, -angle))
        }
    }
}
