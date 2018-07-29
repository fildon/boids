import { config } from "../config";
import { Vector2 } from "../vector2";
import { Creature } from "./creature";
import { Hunter } from "./hunter";
import { Priority } from "./priority";

export class Boid extends Creature {
    public priorities = [
        new Priority(() => this.mouseAvoidVector(), "red"),
        new Priority(() => this.collisionVector(), "red"),
        new Priority(() => this.hunterEvasionVector(), "red"),
        new Priority(() => this.repulsionVector(), "orange"),
        new Priority(() => this.alignmentVector(), "blue"),
        new Priority(() => this.attractionVector(), "green"),
    ];

    public otherCreaturesOfSameType(): Creature[] {
        return this.otherCreaturesOfType(Boid);
    }

    public hunterEvasionVector(): Vector2 {
        const hunters = this.otherCreaturesOfType(Hunter);
        const huntersNearBy = hunters.filter((hunter) =>
            this.distanceToCreature(hunter) < config.hunterFearRadius);
        if (huntersNearBy.length === 0) {
            return new Vector2(0, 0);
        }
        const fearVectors = huntersNearBy.map((hunter) => {
            return hunter.position.vectorTo(this.position);
        });
        return Vector2.average(
            fearVectors,
        ).unitVector();
    }
}
