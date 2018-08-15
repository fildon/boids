import { config } from "../config";
import { Vector2 } from "../vector2";
import { Behaviour } from "./behaviour";
import { Priority } from "./priority";
import { CreatureStorage } from "../creatureStorage";

export abstract class Creature {
    public position: Vector2;
    public velocity = new Vector2();
    public history: Vector2[] = [];
    public abstract defaultColour: string;
    public colour = "black";
    public abstract priorities: Behaviour[];
    public abstract maxSpeed: number;
    public abstract minSpeed: number;
    public abstract size: number;

    constructor(
        public readonly id: number = 0,
        public creatureStorage: CreatureStorage = new CreatureStorage(),
    ) {
        this.position = new Vector2(
            Math.random() * config.screen.maxX,
            Math.random() * config.screen.maxY,
        );
        for (let i = 0; i < config.creature.maxHistory; i++) {
            this.history.push(new Vector2());
        }
        this.initializeVelocity();
    }

    public abstract initializeVelocity(): void;

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
        const priority = this.getCurrentPriorityOrNull();
        if (priority) {
            this.updateHeadingTowards(priority.idealHeading);
            this.colour = priority.color;
            return;
        }

        this.defaultBehaviour();
    }

    public getCurrentPriorityOrNull(): Priority | null {
        for (const priority of this.priorities) {
            const priorityNow = priority.getCurrentPriority();
            if (priorityNow) {
                return priorityNow;
            }
        }
        return null;
    }

    public defaultBehaviour(): void {
        this.colour = this.defaultColour;
        this.velocity = this.velocity.scaleToLength(
            Math.max(this.velocity.length - config.creature.acceleration, this.minSpeed));
        const randomTurn = 2 * config.creature.turningMax * Math.random() - config.creature.turningMax;
        this.velocity = this.velocity.rotate(randomTurn);
    }

    public updateHeadingTowards(vector: Vector2 | null) {
        if (!vector) {
            return;
        }
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

    public wallAvoidVector(): Vector2 | null {
        const xMin = this.position.x;
        const xMax = config.screen.maxX - this.position.x;
        const yMin = this.position.y;
        const yMax = config.screen.maxY - this.position.y;
        let result = new Vector2();
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
        if (result.length === 0) {
            return null;
        }
        return result.scaleToLength(this.velocity.length);
    }

    public abstract die(): void;
}
