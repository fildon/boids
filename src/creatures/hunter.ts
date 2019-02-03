import { config } from "../config";
import { Vector2 } from "../vector2";
import { Behaviour } from "./behaviour";
import { Creature } from "./creature";
import { StaticTools } from "./staticTools";
import THREE = require("three");
import { CreatureStorage } from "../creatureStorage";
import { Canvas } from "../canvas";

export class Hunter extends Creature {
    public defaultColour = config.hunter.defaultColour;
    public maxSpeed = config.hunter.maxSpeed;
    public minSpeed = config.hunter.minSpeed;
    public size = config.hunter.size;
    public priorities = [
        new Behaviour(() => this.huntingVector(), () => 0xff0099),
    ];

    constructor(
        public readonly id: number = 0,
        public creatureStorage: CreatureStorage = new CreatureStorage(new Canvas()),
        public canvas: Canvas = new Canvas(),
        position?: Vector2,
    ) {
        super(id, creatureStorage, canvas, position);
        this.renderedBody.geometry = new THREE.SphereBufferGeometry(10, 16, 8);
    }

    public initializeVelocity(): void {
        const heading = Math.random() * 2 * Math.PI;
        this.velocity = new Vector2(
            config.hunter.minSpeed * Math.cos(heading),
            config.hunter.minSpeed * Math.sin(heading),
        );
    }

    public update() {
        this.eat();
        this.move();
        this.renderedBody.position.x = this.position.x;
        this.renderedBody.position.y = this.position.y;
        this.renderedBody.material = new THREE.MeshBasicMaterial({ color: this.colour })
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

    public eat() {
        this.creatureStorage.getBoidsInArea(
            this.position,
            config.hunter.eatRadius,
        ).forEach((prey) => prey.die());
    }
}
