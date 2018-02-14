import { config } from "./config";
import { Vector2 } from "./vector2";

export class Boid {
    public position: Vector2;
    public velocity: Vector2;
    public body: HTMLElement | null = null;
    public beak: HTMLElement | null = null;
    public otherBoids: Boid[] = [];

    constructor() {
        this.position = new Vector2(
            Math.random() * (config.maxX - config.minX) + config.minX,
            Math.random() * (config.maxY - config.minY) + config.minY,
        );

        const heading = Math.random() * 2 * Math.PI;
        const speedRange = config.maxSpeed - config.minSpeed;
        const speed = config.minSpeed + (Math.random() * speedRange);
        this.velocity = new Vector2(
            speed * Math.cos(heading),
            speed * Math.sin(heading),
        );
    }

    public nearestNeighbour(): Boid {
        if (this.otherBoids.length === 0) {
            throw new Error("No other boids");
        }
        return this.otherBoids.reduce((nearestBoid, currentBoid) => {
            const nearestDistance = this.distanceToBoid(nearestBoid);
            const currentDistance = this.distanceToBoid(currentBoid);
            return currentDistance < nearestDistance ? currentBoid : nearestBoid;
        });
    }

    public distanceToBoid(boid: Boid): number {
        return this.position.distance(boid.position);
    }

    public move() {
        this.position = this.position.add(this.velocity);
        this.position = this.position.clip(config.minX, config.maxX, config.minY, config.maxY);
        this.updateHeading();
    }

    public updateHeading() {
        const collisionVector = this.collisionVector();
        if (collisionVector.length() > 0) {
            return this.updateHeadingTowards(collisionVector);
        }
        const repulsionVector = this.repulsionVector();
        if (repulsionVector.length() > 0) {
            return this.updateHeadingTowards(repulsionVector);
        }
        const alignmentVector = this.alignmentVector();
        if (alignmentVector.length() > 0) {
            return this.updateHeadingTowards(alignmentVector);
        }
        const attractionVector = this.attractionVector();
        if (attractionVector.length() > 0) {
            return this.updateHeadingTowards(attractionVector);
        }
        const randomTurn = 2 * config.turningMax * Math.random() - config.turningMax;
        this.velocity = this.velocity.rotate(randomTurn);
    }

    public updateHeadingTowards(vector: Vector2) {
        const idealTurn = this.velocity.angleTo(vector);
        const limitedTurn = Math.max(Math.min(idealTurn, config.turningMax), -config.turningMax);
        this.velocity = this.velocity.rotate(limitedTurn);
        return;
    }

    public collisionVector(): Vector2 {
        const xMin = this.position.x - config.minX;
        const xMax = config.maxX - this.position.x;
        const yMin = this.position.y - config.minY;
        const yMax = config.maxY - this.position.y;
        if (xMin < config.collisionRadius) {
            return new Vector2(1, 0);
        }
        if (xMax < config.collisionRadius) {
            return new Vector2(-1, 0);
        }
        if (yMin < config.collisionRadius) {
            return new Vector2(0, 1);
        }
        if (yMax < config.collisionRadius) {
            return new Vector2(0, -1);
        }
        return new Vector2(0, 0);
    }

    public repulsionVector(): Vector2 {
        return Vector2.average(
            this.neighbours(config.repulsionRadius).map((boid) => {
                return this.position.vectorTo(boid.position);
            }),
        ).unitVector().scaleByScalar(-1);
    }

    public attractionVector(): Vector2 {
        if (this.otherBoids.length === 0) {
            return new Vector2(0, 0);
        }
        return Vector2.average(
            this.neighbours(config.attractionRadius).map((boid) => {
                return this.position.vectorTo(boid.position);
            }),
        ).unitVector();
    }

    public alignmentVector(): Vector2 {
        return Vector2.average(
            this.neighbours(config.alignmentRadius).map((boid) => {
                return boid.velocity;
            }),
        ).unitVector();
    }

    public neighbours(radius: number): Boid[] {
        if (this.otherBoids.length === 0) {
            return [];
        }
        return this.otherBoids.filter((boid) => {
            return this.distanceToBoid(boid) < radius;
        });
    }
}
