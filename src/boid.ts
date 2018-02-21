import { config } from "./config";
import { Vector2 } from "./vector2";

export class Boid {
    public position: Vector2;
    public velocity: Vector2;
    public history: Vector2[] = [];
    public otherBoids: Boid[] = [];
    public mousePosition: Vector2 = new Vector2(-1, -1);

    constructor() {
        this.position = new Vector2(0, 0);
        for (let i = 0; i < config.maxHistory; i++) {
            this.history.push(new Vector2(0, 0));
        }
        const heading = Math.random() * 2 * Math.PI;
        const speedRange = config.maxSpeed - config.minSpeed;
        const speed = config.minSpeed + (Math.random() * speedRange);
        this.velocity = new Vector2(
            speed * Math.cos(heading),
            speed * Math.sin(heading),
        );
    }

    public distanceToBoid(boid: Boid): number {
        return this.position.distance(boid.position);
    }

    public move() {
        this.history.push(this.position);
        while (this.history.length > config.maxHistory) {
            this.history = this.history.slice(1);
        }
        this.position = this.position.add(this.velocity);
        this.position = this.position.clip(0, config.maxX, 0, config.maxY);
        this.updateHeading();
    }

    public updateHeading() {
        const mouseAvoidVector = this.mouseAvoidVector();
        if (mouseAvoidVector.length() > 0) {
            return this.updateHeadingTowards(mouseAvoidVector);
        }
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

    public mouseAvoidVector(): Vector2 {
        if (this.mousePosition.x !== -1) {
            const vectorFromMouse = this.mousePosition.vectorTo(this.position);
            if (vectorFromMouse.length() < config.mouseRadius) {
                return vectorFromMouse.unitVector();
            }
        }
        return new Vector2(0, 0);
    }

    public collisionVector(): Vector2 {
        const xMin = this.position.x;
        const xMax = config.maxX - this.position.x;
        const yMin = this.position.y;
        const yMax = config.maxY - this.position.y;
        let result = new Vector2(0, 0);
        if (xMin < config.collisionRadius) {
            result = result.add(new Vector2(1, 0));
        }
        if (xMax < config.collisionRadius) {
            result = result.add(new Vector2(-1, 0));
        }
        if (yMin < config.collisionRadius) {
            result = result.add(new Vector2(0, 1));
        }
        if (yMax < config.collisionRadius) {
            result = result.add(new Vector2(0, -1));
        }
        return result;
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
        return this.otherBoids.filter((boid) => {
            return this.distanceToBoid(boid) < radius;
        });
    }
}
