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
        const direction = this.inputHandler.getDirectionInput();
        this.heading += Math.max(-0.1, Math.min(0.1, direction));
        this.speed += Math.max(0, 0.5 - 0.5 * Math.abs(1 - Math.abs(direction / 10)));
        this.speed *= 0.98;
        this.position = this.position.add(this.velocity()).normalize();
    }
}
