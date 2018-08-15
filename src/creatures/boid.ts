import { config } from "../config";
import { Vector2 } from "../vector2";
import { Behaviour } from "./behaviour";
import { Creature } from "./creature";
import { StaticTools } from "./staticTools";

export class Boid extends Creature {
    public mousePosition: Vector2 | null = null;
    public defaultColour = config.boid.defaultColour;
    public maxSpeed = config.boid.maxSpeed;
    public minSpeed = config.boid.minSpeed;
    public size = config.boid.size;
    public priorities = [
        new Behaviour(() => this.mouseAvoidVector(), "red"),
        new Behaviour(() => this.wallAvoidVector(), "red"),
        new Behaviour(() => this.hunterEvasionVector(), "red"),
        new Behaviour(() => this.repulsionVector(), "orange"),
        new Behaviour(() => this.alignmentVector(), "blue"),
        new Behaviour(() => this.attractionVector(), "green"),
    ];

    public initializeVelocity(): void {
        const heading = Math.random() * 2 * Math.PI;
        this.velocity = new Vector2(
            config.boid.minSpeed * Math.cos(heading),
            config.boid.minSpeed * Math.sin(heading),
        );
    }

    public mouseAvoidVector(): Vector2 | null {
        if (this.mousePosition) {
            const vectorFromMouse = this.mousePosition.vectorTo(this.position);
            if (vectorFromMouse.length < config.boid.mouseAvoidRadius) {
                return vectorFromMouse.scaleToLength(this.maxSpeed);
            }
        }
        return null;
    }

    public repulsionVector(): Vector2 | null {
        const neighbours = this.creatureStorage.getBoidsInArea(
            this.position,
            config.boid.repulsionRadius,
        ).filter((boid) => boid.id !== this.id);
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
        const huntersInSight = this.creatureStorage.getHuntersInArea(
            this.position,
            config.boid.visionRadius,
        );
        if (huntersInSight.length === 0) {
            return null;
        }

        const nearestHunter = StaticTools
            .nearestCreatureToPosition(huntersInSight, this.position);

        return nearestHunter.position
            .vectorTo(this.position)
            .scaleToLength(this.maxSpeed);
    }

    public alignmentVector(): Vector2 | null {
        const alignmentFuzz = 0.05;
        const neighbours = this.creatureStorage.getBoidsInArea(
            this.position,
            config.boid.alignmentRadius,
        ).filter((boid) => boid.id !== this.id);
        if (neighbours.length === 0) {
            return null;
        }
        return Vector2.average(
            neighbours.map((creature) => {
                return creature.velocity;
            }),
        )
        .rotate(2 * alignmentFuzz * Math.random() - alignmentFuzz);
    }

    public attractionVector(): Vector2 | null {
        const neighbours = this.creatureStorage.getBoidsInArea(
            this.position,
            config.boid.attractionRadius,
        ).filter((boid) => boid.id !== this.id);
        if (neighbours.length === 0) {
            return null;
        }

        const nearestNeighbour = StaticTools
            .nearestCreatureToPosition(neighbours, this.position);

        return this.position
            .vectorTo(nearestNeighbour.position)
            .scaleToLength(nearestNeighbour.velocity.length * 1.1);
    }

    public die(): void {
        this.creatureStorage.removeBoid(this.id);
    }
}
