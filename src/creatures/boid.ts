import { config } from "../config";
import { Vector2 } from "../vector2";
import { Behaviour } from "./behaviour";
import { Creature } from "./creature";
import { Hunter } from "./hunter";
import { StaticTools } from "./staticTools";

export class Boid extends Creature {
    public defaultColour = config.boid.defaultColour;
    public maxSpeed = config.boid.maxSpeed;
    public minSpeed = config.boid.minSpeed;
    public priorities = [
        new Behaviour(() => this.mouseAvoidVector(), "red"),
        new Behaviour(() => this.wallAvoidVector(), "red"),
        new Behaviour(() => this.hunterEvasionVector(), "red"),
        new Behaviour(() => this.repulsionVector(), "orange"),
        new Behaviour(() => this.alignmentVector(), "blue"),
        new Behaviour(() => this.attractionVector(), "green"),
    ];
    public size = config.boid.size;

    public otherCreaturesOfSameType(): Creature[] {
        return this.otherCreaturesOfType(Boid);
    }

    public mouseAvoidVector(): Vector2 | null {
        if (this.mousePosition.x !== -1) {
            const vectorFromMouse = this.mousePosition.vectorTo(this.position);
            if (vectorFromMouse.length < config.boid.mouseAvoidRadius) {
                return vectorFromMouse.scaleToLength(this.maxSpeed);
            }
        }
        return null;
    }

    public repulsionVector(): Vector2 | null {
        const neighbours = this.neighbours(config.boid.repulsionRadius);
        if (neighbours.length === 0) {
            return null;
        }
        return Vector2.average(
            neighbours.map((creature) => {
                return creature.position.vectorTo(this.position);
            }),
        ).scaleToLength(this.velocity.length * 0.9);
    }

    public hunterEvasionVector(): Vector2 | null {
        const allHunters = this.otherCreaturesOfType(Hunter);
        const huntersNearBy = allHunters.filter((hunter) =>
            this.distanceToCreature(hunter) < config.boid.visionRadius);
        if (huntersNearBy.length === 0) {
            return null;
        }

        const nearestHunter = StaticTools
            .nearestCreatureToPosition(huntersNearBy, this.position);

        return nearestHunter.position
            .vectorTo(this.position)
            .scaleToLength(this.maxSpeed);
    }

    public alignmentVector(): Vector2 | null {
        const alignmentFuzz = 0.05;
        const neighbours = this.neighbours(config.boid.alignmentRadius);
        if (neighbours.length === 0) {
            return null;
        }
        return Vector2.average(
            neighbours.map((creature) => {
                return creature.velocity;
            }),
        ).scaleByScalar(0.95)
        .rotate(2 * alignmentFuzz * Math.random() - alignmentFuzz);
    }

    public attractionVector(): Vector2 | null {
        const neighbours = this.neighbours(config.boid.attractionRadius);
        if (neighbours.length === 0) {
            return null;
        }

        const nearestNeighbour = StaticTools
            .nearestCreatureToPosition(neighbours, this.position);

        return this.position
            .vectorTo(nearestNeighbour.position)
            .scaleToLength(nearestNeighbour.velocity.length * 1.1);
    }
}
