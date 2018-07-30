import { config } from "../config";
import { Vector2 } from "../vector2";
import { Boid } from "./boid";
import { Creature } from "./creature";
import { Priority } from "./priority";

export class Hunter extends Creature {
    public defaultColour: string;
    public maxSpeed = config.hunter.maxSpeed;
    public minSpeed = config.hunter.minSpeed;
    public eatCallback: () => void;
    public priorities = [
        new Priority(() => this.wallAvoidVector(), "red"),
        new Priority(() => this.huntingVector(), "DeepPink"),
    ];
    public size = config.hunter.size;
    constructor(id: number, creatures: Map<number, Creature>, eatCallback: () => void) {
        super(id, creatures);
        this.eatCallback = eatCallback;
        this.colour = "black";
        this.defaultColour = config.hunter.defaultColour;
        const heading = Math.random() * 2 * Math.PI;
        this.velocity = new Vector2(
            this.minSpeed * Math.cos(heading),
            this.minSpeed * Math.sin(heading),
        );
    }

    public otherCreaturesOfSameType(): Creature[] {
        return this.otherCreaturesOfType(Hunter);
    }

    public update() {
        this.eat();
        this.move();
    }

    public huntingVector(): Vector2 {
        const nearestPrey = this.findNearestPrey();
        if (nearestPrey !== null) {
            return this.position.vectorTo(nearestPrey.position.add(nearestPrey.velocity));
        } else {
            return new Vector2(0, 0);
        }
    }

    private findNearestPrey(): Creature | null {
        let prey = null;
        let distanceToPrey = Infinity;
        const preyInSight = this.otherCreaturesOfType(Boid).filter((boid) =>
            this.distanceToCreature(boid) < config.hunter.visionRadius);
        for (const creature of preyInSight) {
            const vectorToCreature = this.position.vectorTo(creature.position);
            if (vectorToCreature.length < distanceToPrey) {
                prey = creature;
                distanceToPrey = vectorToCreature.length;
            }
        }
        return prey;
    }

    private eat() {
        for (const creature of this.otherCreaturesOfType(Boid)) {
            if (this.position.distance(creature.position) < config.hunter.eatRadius) {
                creature.die();
                this.eatCallback();
            }
        }
    }
}
