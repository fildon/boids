import { config } from "../config";
import { Creature } from "./creature";

export class Boid extends Creature {
    public updateHeading() {
        const priorities = [
            () => this.mouseAvoidVector(),
            () => this.collisionVector(),
            () => this.repulsionVector(),
            () => this.alignmentVector(),
            () => this.attractionVector(),
        ];
        for (const priority of priorities) {
            const priorityVector = priority();
            if (priorityVector.length() > 0) {
                return this.updateHeadingTowards(priorityVector);
            }
        }
        const randomTurn = 2 * config.turningMax * Math.random() - config.turningMax;
        this.velocity = this.velocity.rotate(randomTurn);
    }
}
