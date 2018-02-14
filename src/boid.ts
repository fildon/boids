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
            Math.random() * 80 + 10,
            Math.random() * 80 + 10,
        );

        const heading = Math.random() * 2 * Math.PI;
        this.velocity = new Vector2(
            config.speed * Math.cos(heading),
            config.speed * Math.sin(heading),
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
        this.position = this.position.clip(10, 90, 10, 90);
        this.updateHeading();
    }

    public updateHeading() {
        const repulsionVector = this.repulsionVector();
        if (repulsionVector.length() > 0) {
            const idealTurn = this.velocity.angleTo(repulsionVector);
            const limitedTurn = Math.max(Math.min(idealTurn, config.turningMax), -config.turningMax);
            this.velocity = this.velocity.rotate(limitedTurn);
            return;
        }
        const alignmentVector = this.alignmentVector();
        if (alignmentVector.length() > 0) {
            const idealTurn = this.velocity.angleTo(alignmentVector);
            const limitedTurn = Math.max(Math.min(idealTurn, config.turningMax), -config.turningMax);
            this.velocity = this.velocity.rotate(limitedTurn);
            return;
        }
        const attractionVector = this.attractionVector();
        if (attractionVector.length() > 0) {
            const idealTurn = this.velocity.angleTo(attractionVector);
            const limitedTurn = Math.max(Math.min(idealTurn, config.turningMax), -config.turningMax);
            this.velocity = this.velocity.rotate(limitedTurn);
            return;
        }
        const randomTurn = 2 * config.turningMax * Math.random() - config.turningMax;
        this.velocity = this.velocity.rotate(randomTurn);
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
