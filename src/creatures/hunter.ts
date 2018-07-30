import { config } from "../config";
import { Vector2 } from "../vector2";
import { Behaviour } from "./behaviour";
import { Boid } from "./boid";
import { Creature } from "./creature";
import { StaticTools } from "./staticTools";

export class Hunter extends Creature {
    public defaultColour: string;
    public maxSpeed = config.hunter.maxSpeed;
    public minSpeed = config.hunter.minSpeed;
    public eatCallback: () => void;
    public priorities = [
        new Behaviour(() => this.wallAvoidVector(), "red"),
        new Behaviour(() => this.huntingVector(), "DeepPink"),
    ];
    public size = config.hunter.size;
    constructor(id: number, creatures: Map<number, Creature>, eatCallback: () => void) {
        super(id, creatures);
        this.eatCallback = eatCallback;
        this.defaultColour = config.hunter.defaultColour;
        const heading = Math.random() * 2 * Math.PI;
        this.velocity = new Vector2(
            this.minSpeed * Math.cos(heading),
            this.minSpeed * Math.sin(heading),
        );
    }

    public otherCreaturesOfSameType(): Creature[] {
        return this.otherCreaturesOfType(Hunter);
    }

    public update() {
        this.eat();
        this.move();
    }

    public huntingVector(): Vector2 | null {
        const preyInSight = this.otherCreaturesOfType(Boid).filter((boid) => {
            return this.distanceToCreature(boid) < config.hunter.visionRadius;
        });

        if (preyInSight.length === 0) {
            return null;
        }

        const nearestPrey = StaticTools
            .nearestCreatureToPosition(preyInSight, this.position);
        return this.position
            .vectorTo(nearestPrey.position.add(nearestPrey.velocity))
            .scaleToLength(config.hunter.maxSpeed);
    }

    private eat() {
        for (const creature of this.otherCreaturesOfType(Boid)) {
            if (this.position.distance(creature.position) < config.hunter.eatRadius) {
                creature.die();
                this.eatCallback();
            }
        }
    }
}
