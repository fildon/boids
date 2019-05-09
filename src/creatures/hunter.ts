import { config } from "../config";
import { Vector2 } from "../vector2";
import { Behaviour } from "./behaviour";
import { Creature } from "./creature";
import { StaticTools } from "./staticTools";

export class Hunter extends Creature {
    public defaultColour = config.hunter.defaultColour;
    public maxSpeed = config.hunter.maxSpeed;
    public minSpeed = config.hunter.minSpeed;
    public size = config.hunter.size;
    public priorities = [
        new Behaviour(() => this.repulsionVector(), () => "blue"),
        new Behaviour(() => this.huntingVector(), () => "DeepPink"),
    ];
    private hungerCounter = 0;

    public initializeVelocity(): void {
        const heading = Math.random() * 2 * Math.PI;
        this.velocity = new Vector2(
            config.hunter.minSpeed * Math.cos(heading),
            config.hunter.minSpeed * Math.sin(heading),
        );
    }

    public update() {
        this.hungerCounter++;
        this.eat();
        this.move();
        this.reproduceOrDie();
    }

    public chanceToSee(viewerPosition: Vector2, viewerSightRange: number): number {
        const distance = viewerPosition.distance(this.position);
        const visibilityFromDistance = (viewerSightRange - distance) / viewerSightRange;
        const visibilityFromSpeed =
            (this.velocity.length - config.hunter.minSpeed)
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
            .vectorTo(nearestPrey.position.add(nearestPrey.velocity))
            .scaleToLength(config.hunter.maxSpeed);
    }

    public repulsionVector(): Vector2 | null {
        const neighbours = this.creatureStorage.getHuntersInArea(
            this.position,
            config.hunter.repulsionRadius,
        ).filter((hunter) => hunter.id !== this.id);
        if (neighbours.length === 0) {
            return null;
        }
        return Vector2.average(
            neighbours.map((creature) => {
                return creature.position.vectorTo(this.position);
            }),
        ).scaleToLength(this.maxSpeed);
    }

    public eat() {
        const prey = this.creatureStorage.getBoidsInArea(
            this.position,
            config.hunter.eatRadius,
        );
        prey.forEach((boid) => boid.die());
        if (prey.length > 0) {
            this.hungerCounter = 0;
        }
    }

    public die(): void {
        this.creatureStorage.remove(this.id);
    }

    public reproduceOrDie(): void {
        if (this.hungerCounter > config.hunter.hungerLimit || this.frameCount > config.hunter.reproductionAge * 2) {
            return this.die();
        }
        if (this.frameCount > config.hunter.reproductionAge && this.hungerCounter < 100 && Math.random() < 0.01) {
            this.creatureStorage.addHunter(this.position);
            this.frameCount = 0;
        }
    }
}
