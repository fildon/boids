import { config } from "../config";
import { Vector2 } from "../vector2";
import { Behaviour } from "./behaviour";
import { StaticTools } from "./staticTools";
import { BehaviourControlledCreature } from "./behaviourControlledCreature";

export class Hunter extends BehaviourControlledCreature {
    public defaultColour = config.hunter.defaultColour;
    public maxSpeed = config.hunter.maxSpeed;
    public minSpeed = config.hunter.minSpeed;
    public size = config.hunter.size;
    public heading = 0;
    public speed = 0;
    public priorities = [
        new Behaviour(() => this.huntingVector(), () => "DeepPink"),
    ];

    public initializeVelocity(): void {
        this.heading = Math.random() * 2 * Math.PI;
        this.speed = config.hunter.minSpeed;
    }

    public update() {
        this.eat();
        this.move();
    }

    public chanceToSee(viewerPosition: Vector2, viewerSightRange: number): number {
        const distance = viewerPosition.distance(this.position);
        const visibilityFromDistance = (viewerSightRange - distance) / viewerSightRange;
        const visibilityFromSpeed =
            (this.speed - config.hunter.minSpeed)
            / (config.hunter.maxSpeed - config.hunter.minSpeed);
        return visibilityFromDistance * visibilityFromSpeed;
    }

    public huntingVector(): Vector2 | null {
        const preyInSight = this.creatureStorage.getBoidsInArea(
            this.position,
            config.hunter.visionRadius,
        );

        if (preyInSight.length === 0) {
            return null;
        }

        const nearestPrey = StaticTools
            .nearestCreatureToPosition(preyInSight, this.position);
        return this.position
            .vectorTo(nearestPrey.position.add(nearestPrey.velocity()))
            .scaleToLength(config.hunter.maxSpeed);
    }

    public eat() {
        this.creatureStorage.getBoidsInArea(
            this.position,
            config.hunter.eatRadius,
        ).forEach((prey) => prey.die());
    }

    public die(): void {
        this.creatureStorage.remove(this.id);
    }
}
