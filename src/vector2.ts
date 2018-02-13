export class Vector2 {
    public x: number;
    public y: number;
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
        const xcopy = this.x;
        const ycopy = this.y;
        this.x = xcopy * Math.cos(radians) - ycopy * Math.sin(radians);
        this.y = xcopy * Math.sin(radians) + ycopy * Math.cos(radians);
    }

    public rotateAwayFrom(vector: Vector2, angle: number): void {
        const relativeAngleFromVectorToThis = Math.atan2(
            vector.x * this.y - vector.y * this.x,
            vector.x * this.x + vector.y * this.y,
        );
        if (relativeAngleFromVectorToThis > 0) {
            this.rotate(Math.min(Math.PI - relativeAngleFromVectorToThis, angle));
        } else {
            this.rotate(Math.max(-relativeAngleFromVectorToThis - Math.PI, -angle));
        }
    }

    public add(v: Vector2): void {
        this.x += v.x;
        this.y += v.y;
    }

    public clip(xMin: number, xMax: number, yMin: number, yMax: number) {
        this.x = Math.min(Math.max(this.x, xMin), xMax);
        this.y = Math.min(Math.max(this.y, yMin), yMax);
    }
}
