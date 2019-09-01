import { Vector2 } from "../vector2";
import { InputHandler } from "../inputHandler";
import { Creature } from "./creature";
import { config } from "../config";

export default class PlayerFish extends Creature {
    public colour = "black";
    public size = 6;
    public position: Vector2;
    public heading = 0;
    public speed = 0;
    public history: Vector2[] = [];

    constructor(
        public inputHandler: InputHandler,
    ) {
        super();
        this.position = new Vector2(
            window.innerWidth / 2,
            window.innerHeight / 2,
        );
        for (let i = 0; i < config.creature.maxHistory; i++) {
            this.history.push(this.position);
        }
    }

    public update() {
        this.updateHistory();
        this.heading += this.inputHandler.getHeadingUpdate();
        this.speed += this.inputHandler.getSpeedUpdate();
        this.speed = Math.max(
            Math.min(
                this.speed,
                config.player.maxSpeed,
            ),
            config.player.minSpeed,
        );
        this.position = this.position
            .add(this.velocity()).normalize();
    }
}
