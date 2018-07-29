import { config } from "../config";
import { Vector2 } from "../vector2";
import { Creature } from "./creature";
import { Hunter } from "./hunter";
import { Priority } from "./priority";

export class Boid extends Creature {
    public speed = config.boidSpeed;
    public priorities = [
        new Priority(() => this.mouseAvoidVector(), "red"),
        new Priority(() => this.wallAvoidVector(), "red"),
        new Priority(() => this.hunterEvasionVector(), "red"),
        new Priority(() => this.repulsionVector(), "orange"),
        new Priority(() => this.alignmentVector(), "blue"),
        new Priority(() => this.attractionVector(), "green"),
    ];

    public otherCreaturesOfSameType(): Creature[] {
        return this.otherCreaturesOfType(Boid);
    }

    public mouseAvoidVector(): Vector2 {
        if (this.mousePosition.x !== -1) {
            const vectorFromMouse = this.mousePosition.vectorTo(this.position);
            if (vectorFromMouse.length < config.mouseRadius) {
                return vectorFromMouse.scaleToLength(this.speed);
            }
        }
        return new Vector2(0, 0);
    }

    public repulsionVector(): Vector2 {
        return Vector2.average(
            this.neighbours(config.repulsionRadius).map((creature) => {
                return creature.position.vectorTo(this.position);
            }),
        ).scaleToLength(this.velocity.length);
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
        ).scaleToLength(this.speed);
    }

    public alignmentVector(): Vector2 {
        return Vector2.average(
            this.neighbours(config.alignmentRadius).map((creature) => {
                return creature.velocity;
            }),
        ).scaleByScalar(0.95);
    }

    public attractionVector(): Vector2 {
        if (this.otherCreatures().length === 0) {
            return new Vector2(0, 0);
        }
        return Vector2.average(
            this.neighbours(config.attractionRadius).map((creature) => {
                return this.position.vectorTo(creature.position);
            }),
        ).scaleToLength(this.velocity.length);
    }
}
