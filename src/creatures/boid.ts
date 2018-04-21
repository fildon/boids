import { config } from "../config";
import { Vector2 } from "../vector2";
import { Creature } from "./creature";
import { Hunter } from "./hunter";

export class Boid extends Creature {
    public priorities = [
        () => this.mouseAvoidVector(),
        () => this.collisionVector(),
        () => this.hunterEvasionVector(),
        () => this.repulsionVector(),
        () => this.alignmentVector(),
        () => this.attractionVector(),
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
