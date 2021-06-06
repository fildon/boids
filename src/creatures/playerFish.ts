import { Vector } from "../geometry/vector";
import { InputHandler } from "../ui/inputHandler";
import { Creature } from "./creature";
import { config } from "../stateManagement/config";

export default class PlayerFish extends Creature {
  public colour = "black";
  public size = 6;
  public position: Vector;
  public heading = 0;
  public speed = 3.1;
  public history: Vector[] = [];
  private inputHandler = new InputHandler();

  constructor() {
    super();
    this.position = new Vector(window.innerWidth / 2, window.innerHeight / 2);
    for (let i = 0; i < config.creature.maxHistory; i++) {
      this.history.push(this.position);
    }
  }

  public update(): void {
    this.updateHistory();
    this.heading += this.inputHandler.getHeadingUpdate();
    this.speed += this.inputHandler.getSpeedUpdate();
    this.speed = Math.max(
      Math.min(this.speed, config.player.maxSpeed),
      config.player.minSpeed
    );
    this.position = this.position.add(this.velocity()).normalize();
  }
}
