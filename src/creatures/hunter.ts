import { config } from "../config";
import { Vector2 } from "../vector2";
import { Boid } from "./boid";
import { Creature } from "./creature";
import { Priority } from "./priority";

export class Hunter extends Creature {
    public eatCallback: () => void;
    public priorities = [
        new Priority(() => this.collisionVector(), "black"),
        new Priority(() => this.hunterRepulsionVector(), "black"),
        new Priority(() => this.huntingVector(), "black"),
    ];
    constructor(id: number, creatures: Map<number, Creature>, eatCallback: () => void) {
        super(id, creatures);
        this.eatCallback = eatCallback;
        this.colour = "black";
        const speed = config.hunterSpeed;
        const heading = Math.random() * 2 * Math.PI;
        this.velocity = new Vector2(
            speed * Math.cos(heading),
            speed * Math.sin(heading),
        );
    }

    public hunterNeighbours(): Creature[] {
        return this.otherCreaturesOfSameType().filter((creature) => {
            return this.position
                .add(this.velocity.scaleToLength(config.hunterRepulsionOffset))
                .distance(creature.position) < config.repulsionRadius;
        });
    }

    public hunterRepulsionVector(): Vector2 {
        return Vector2.average(
            this.hunterNeighbours().map((creature) => {
                return creature.position.vectorTo(this.position);
            }),
        ).unitVector();
    }

    public otherCreaturesOfSameType(): Creature[] {
        return this.otherCreaturesOfType(Hunter);
    }

    public update() {
        this.eat();
        this.move();
    }

    public huntingVector(): Vector2 {
        let prey = null;
        let distanceToPrey = Infinity;
        for (const creature of this.otherCreaturesOfType(Boid)) {
            const vectorToCreature = this.position.vectorTo(creature.position);
            if (vectorToCreature.length() < distanceToPrey) {
                prey = creature;
                distanceToPrey = vectorToCreature.length();
            }
        }
        if (prey !== null) {
            return this.position.vectorTo(prey.position);
        } else {
            return new Vector2(0, 0);
        }
    }

    private eat() {
        for (const creature of this.otherCreaturesOfType(Boid)) {
            if (this.position.distance(creature.position) < config.eatRadius) {
                creature.die();
                this.eatCallback();
            }
        }
    }
}
