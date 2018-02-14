export class Vector2 {
    public static average(vectors: Vector2[]): Vector2 {
        if (vectors.length === 0) {
            return new Vector2(0, 0);
        }
        const totalVector = vectors.reduce((partialSum, current) => {
            return partialSum.add(current);
        });

        const averageVector = totalVector.scaleByScalar(1 / vectors.length);

        return averageVector;
    }

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

    public rotate(radians: number): Vector2 {
        return new Vector2(
            this.x * Math.cos(radians) - this.y * Math.sin(radians),
            this.x * Math.sin(radians) + this.y * Math.cos(radians),
        );
    }

    public rotateAwayFrom(vector: Vector2, angle: number): Vector2 {
        const relativeAngleFromVectorToThis = Math.atan2(
            vector.x * this.y - vector.y * this.x,
            vector.x * this.x + vector.y * this.y,
        );
        if (relativeAngleFromVectorToThis > 0) {
            return this.rotate(Math.min(Math.PI - relativeAngleFromVectorToThis, angle));
        } else {
            return this.rotate(Math.max(-relativeAngleFromVectorToThis - Math.PI, -angle));
        }
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
}
