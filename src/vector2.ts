export class Vector2 {
    public static average(vectors: Vector2[]): Vector2 {
        if (vectors.length === 0) {
            return new Vector2(0, 0);
        }
        const totalVector = vectors.reduce((partialSum, current) => {
            return partialSum.add(current);
        });

        return totalVector.scaleByScalar(1 / vectors.length);
    }

    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public unitVector(): Vector2 {
        const length = this.length();
        return this.scaleByScalar(1 / length);
    }

    public distance(v: Vector2): number {
        return this.vectorTo(v).length();
    }

    public vectorTo(vector: Vector2): Vector2 {
        return new Vector2(vector.x - this.x, vector.y - this.y);
    }

    public rotate(radians: number): Vector2 {
        return new Vector2(
            this.x * Math.cos(radians) - this.y * Math.sin(radians),
            this.x * Math.sin(radians) + this.y * Math.cos(radians),
        );
    }

    // Measures anti clockwise from -PI to PI
    public angleTo(v: Vector2): number {
        return Math.atan2(
            this.x * v.y - this.y * v.x,
            this.x * v.x + this.y * v.y,
        );
    }

    public add(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    public clip(xMin: number, xMax: number, yMin: number, yMax: number) {
        return new Vector2(
            Math.min(Math.max(this.x, xMin), xMax),
            Math.min(Math.max(this.y, yMin), yMax),
        );
    }

    public equals(v: Vector2): boolean {
        return this.x === v.x && this.y === v.y;
    }

    public length(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    public scaleByScalar(scale: number): Vector2 {
        return new Vector2(this.x * scale, this.y * scale);
    }

    public scaleToLength(length: number): Vector2 {
        return this.scaleByScalar(length / this.length());
    }
}
