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
        this.position.add(this.velocity);
        this.position.clip(10, 90, 10, 90);
        this.updateHeading();
    }

    public updateHeading() {
        if (this.otherBoids.length > 0) {
            const nearestNeighbour = this.nearestNeighbour();
            if (this.distanceToBoid(nearestNeighbour) < config.repulsionRadius) {
                const relativeVectorTo = this.position.vectorTo(nearestNeighbour.position);
                this.velocity.rotateAwayFrom(relativeVectorTo, config.turningMax);
                return;
            }
        }
        this.velocity.rotate(2 * config.turningMax * Math.random() - config.turningMax);
    }

    public repulsionVector(): Vector2 {
        // TODO implement properly
        return new Vector2(-1, -1);
    }

    public neighbours(radius: number): Boid[] {
        return this.otherBoids.filter((boid) => {
            return this.distanceToBoid(boid) < radius;
        });
    }
}
