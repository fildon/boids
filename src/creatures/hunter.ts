import { config } from "../config";
import { Vector2 } from "../vector2";
import { Creature } from "./creature";

export class Hunter extends Creature {
    constructor(id: number, creatures: Map<number, Creature>) {
        super(id, creatures);
        this.colour = "black";
        const speed = config.minSpeed / 2;
        const heading = Math.random() * 2 * Math.PI;
        this.velocity = new Vector2(
            speed * Math.cos(heading),
            speed * Math.sin(heading),
        );
    }

    public update() {
        this.eat();
        this.move();
    }

    public updateHeading() {
        let prey = null;
        let distanceToPrey = Infinity;
        for (const creature of this.otherCreatures()) {
            if (creature instanceof Hunter) {
                continue;
            } else {
                const vectorToCreature = this.position.vectorTo(creature.position);
                if (vectorToCreature.length() < distanceToPrey) {
                    prey = creature;
                    distanceToPrey = vectorToCreature.length();
                }
            }
        }
        if (prey !== null) {
            this.updateHeadingTowards(this.position.vectorTo(prey.position));
        } else {
            const randomTurn = 2 * config.turningMax * Math.random() - config.turningMax;
            this.velocity = this.velocity.rotate(randomTurn);
        }
    }

    private eat() {
        // DUPLICATED code TODO add a utility for filtering creature by type
        for (const creature of this.otherCreatures()) {
            if (creature instanceof Hunter) {
                continue;
            } else {
                if (this.position.distance(creature.position) < config.eatRadius) {
                    creature.die();
                }
            }
        }
    }
}
