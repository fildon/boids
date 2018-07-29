import { config } from "../config";
import { Vector2 } from "../vector2";
import { Priority } from "./priority";

export abstract class Creature {
    // Where speed is 0 to 1, min to max
    public static colorFromSpeed(speed: number) {
        return "hsl(" + (speed * 360) + ", 50%, 50%)";
    }

    public id: number;
    public position: Vector2;
    public velocity: Vector2;
    public history: Vector2[] = [];
    public creatures: Map<number, Creature>;
    public mousePosition: Vector2 = new Vector2(-1, -1);
    public colour: string;
    public abstract priorities: Priority[];

    constructor(id: number, creatures: Map<number, Creature>) {
        this.id = id;
        this.creatures = creatures;
        this.position = new Vector2(Math.random() * config.maxX, Math.random() * config.maxY);
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
        const speedProportion = (this.velocity.length() - config.minSpeed) / (config.maxSpeed - config.minSpeed);
        this.colour = Creature.colorFromSpeed(speedProportion);
    }

    public distanceToCreature(creature: Creature): number {
        return this.position.distance(creature.position);
    }

    public update() {
        this.move();
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

    public updateHeading(): void {
        for (const priority of this.priorities) {
            const priorityVector = priority.idealHeading();
            if (priorityVector.length() > 0) {
                this.updateHeadingTowards(priorityVector);
                this.colour = priority.color;
                return;
            }
        }

        // TODO this should probably update the colour... default colour?
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
            this.neighbours(config.repulsionRadius).map((creature) => {
                return creature.position.vectorTo(this.position);
            }),
        ).unitVector();
    }

    public attractionVector(): Vector2 {
        if (this.otherCreatures().length === 0) {
            return new Vector2(0, 0);
        }
        return Vector2.average(
            this.neighbours(config.attractionRadius).map((creature) => {
                return this.position.vectorTo(creature.position);
            }),
        ).unitVector();
    }

    public alignmentVector(): Vector2 {
        return Vector2.average(
            this.neighbours(config.alignmentRadius).map((creature) => {
                return creature.velocity;
            }),
        ).unitVector();
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
