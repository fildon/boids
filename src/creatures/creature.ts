import { config } from "../config";
import { Vector2 } from "../vector2";
import { Priority } from "./priority";

export abstract class Creature {
    public id: number;
    public position: Vector2;
    public velocity: Vector2;
    public history: Vector2[] = [];
    public creatures: Map<number, Creature>;
    public mousePosition: Vector2 = new Vector2(-1, -1);
    public colour: string;
    public abstract priorities: Priority[];
    public abstract maxSpeed: number;
    public abstract minSpeed: number;

    constructor(id: number, creatures: Map<number, Creature>) {
        this.id = id;
        this.creatures = creatures;
        this.position = new Vector2(Math.random() * config.screen.maxX, Math.random() * config.screen.maxY);
        for (let i = 0; i < config.creature.maxHistory; i++) {
            this.history.push(new Vector2(0, 0));
        }
        const heading = Math.random() * 2 * Math.PI;
        // TODO shouldn't assume boid on the following line
        const speed = config.boid.minSpeed;
        this.velocity = new Vector2(
            speed * Math.cos(heading),
            speed * Math.sin(heading),
        ).scaleByScalar(0.5);
        this.colour = "black";
    }

    public distanceToCreature(creature: Creature): number {
        return this.position.distance(creature.position);
    }

    public update() {
        this.move();
    }

    public move() {
        this.history.push(this.position);
        while (this.history.length > config.creature.maxHistory) {
            this.history = this.history.slice(1);
        }
        this.position = this.position.add(this.velocity);
        this.position = this.position.clip(0, config.screen.maxX, 0, config.screen.maxY);
        this.updateHeading();
    }

    public updateHeading(): void {
        for (const priority of this.priorities) {
            const priorityVector = priority.idealHeading();
            if (priorityVector.length > 0) {
                this.updateHeadingTowards(priorityVector);
                this.colour = priority.color;
                return;
            }
        }

        // TODO this should probably update the colour... default colour?
        this.velocity = this.velocity.scaleToLength(
            Math.max(this.velocity.length - config.creature.acceleration, this.minSpeed));
        const randomTurn = 2 * config.creature.turningMax * Math.random() - config.creature.turningMax;
        this.velocity = this.velocity.rotate(randomTurn);
    }

    public updateHeadingTowards(vector: Vector2) {
        const idealTurn = this.velocity.angleTo(vector);
        const limitedTurn = Math.max(Math.min(idealTurn, config.creature.turningMax), -config.creature.turningMax);
        let limitedSpeed = Math.max(Math.min(vector.length, this.maxSpeed), this.minSpeed);
        limitedSpeed = Math.max(
            Math.min(
                limitedSpeed,
                this.velocity.length + config.creature.acceleration),
            this.velocity.length - config.creature.acceleration);
        this.velocity = this.velocity.rotate(limitedTurn).scaleToLength(limitedSpeed);
        return;
    }

    public wallAvoidVector(): Vector2 {
        const xMin = this.position.x;
        const xMax = config.screen.maxX - this.position.x;
        const yMin = this.position.y;
        const yMax = config.screen.maxY - this.position.y;
        let result = new Vector2(0, 0);
        if (xMin < config.creature.wallAvoidRadius) {
            result = result.add(new Vector2(1, 0));
        }
        if (xMax < config.creature.wallAvoidRadius) {
            result = result.add(new Vector2(-1, 0));
        }
        if (yMin < config.creature.wallAvoidRadius) {
            result = result.add(new Vector2(0, 1));
        }
        if (yMax < config.creature.wallAvoidRadius) {
            result = result.add(new Vector2(0, -1));
        }
        return result.scaleToLength(this.velocity.length);
    }

    public neighbours(radius: number): Creature[] {
        return this.otherCreaturesOfSameType().filter((creature) => {
            return this.distanceToCreature(creature) < radius;
        });
    }

    public otherCreatures(): Creature[] {
        return [...this.creatures.values()].filter((creature) => creature.id !== this.id);
    }

    public otherCreaturesOfType(creatureType: any): Creature[] {
        return this.otherCreatures().filter((creature) => creature instanceof creatureType);
    }

    public abstract otherCreaturesOfSameType(): Creature[];

    public die(): void {
        this.creatures.delete(this.id);
    }
}
