import { config } from "../config";
import { Vector2 } from "../vector2";
import { Behaviour } from "./behaviour";
import { StaticTools } from "./staticTools";
import { BehaviourControlledCreature } from "./behaviourControlledCreature";

export class Boid extends BehaviourControlledCreature {
    public defaultColour = config.boid.defaultColour;
    public maxSpeed = config.boid.maxSpeed;
    public minSpeed = config.boid.minSpeed;
    public size = config.boid.size;
    public fearCountdown = 0;
    public heading = 2 * Math.PI * Math.random();
    public speed = config.boid.maxSpeed;
    public priorities = [
        new Behaviour(() => this.hunterEvasionVector(), () => "red"),
        new Behaviour(() => this.repulsionVector(), () => this.fearCountdown ? "red" : "orange"),
        new Behaviour(() => this.alignmentVector(), () => this.fearCountdown ? "red" : "blue"),
        new Behaviour(() => this.attractionVector(), () => this.fearCountdown ? "red" : "green"),
    ];

    public initializeVelocity(): void {
        this.heading = Math.random() * 2 * Math.PI;
        this.speed = config.boid.maxSpeed;
    }

    public update(): void {
        if (this.fearCountdown) {
            this.fearCountdown--;
        }
        this.move();
    }

    public hunterEvasionVector(): Vector2 | null {
        const huntersInSight = this.creatureStorage.getHuntersInArea(
            this.position,
            config.boid.visionRadius,
        ).filter((hunter) => {
            return Math.random() < hunter.chanceToSee(this.position, config.boid.visionRadius);
        });
        if (huntersInSight.length === 0) {
            return null;
        }

        this.fearCountdown = config.boid.fearDuration;

        const nearestHunter = StaticTools
            .nearestCreatureToPosition(huntersInSight, this.position);

        return nearestHunter.position
            .vectorTo(this.position)
            .scaleToLength(this.maxSpeed);
    }

    public repulsionVector(): Vector2 | null {
        const neighbours = this.creatureStorage.getBoidsOrPlayersInArea(
            this.position,
            config.boid.repulsionRadius,
        ).filter((boid) => boid !== this);
        if (neighbours.length === 0) {
            return null;
        }
        return Vector2.average(
            neighbours.map((creature) => {
                return creature.position.vectorTo(this.position);
            }),
        ).scaleToLength(
            this.fearCountdown
            ? this.maxSpeed
            : this.speed * 0.9);
    }

    public alignmentVector(): Vector2 | null {
        const neighbours = this.creatureStorage.getBoidsOrPlayersInArea(
            this.position,
            config.boid.alignmentRadius,
        ).filter((boid) => boid !== this);
        if (neighbours.length === 0) {
            return null;
        }
        const averageAlignmentVector = Vector2.average(
            neighbours.map((creature) => {
                return creature.velocity();
            }),
        );
        if (this.fearCountdown) {
            return averageAlignmentVector.scaleToLength(this.maxSpeed);
        }
        return averageAlignmentVector;
    }

    public attractionVector(): Vector2 | null {
        const neighbours = this.creatureStorage.getBoidsOrPlayersInArea(
            this.position,
            config.boid.attractionRadius,
        ).filter((boid) => boid !== this);
        if (neighbours.length === 0) {
            return null;
        }

        const nearestNeighbour = StaticTools
            .nearestCreatureToPosition(neighbours, this.position);

        return this.position
            .vectorTo(nearestNeighbour.position)
            .scaleToLength(
                this.fearCountdown
                ? this.maxSpeed
                : nearestNeighbour.speed * 1.1);
    }

    public die(): void {
        this.creatureStorage.remove(this.id);
    }
}
