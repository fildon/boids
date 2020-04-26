import { Vector2 } from "../vector2";
import { Priority } from "./priority";

export class Behaviour {
  constructor(
    public getIdealHeading: (() => Vector2 | null),
    public getWeight: () => number,
    public getColor: () => string,
  ) {
  }
  public getCurrentPriority(): Priority | null {
    const currentPriority = this.getIdealHeading();
    if (currentPriority) {
      return new Priority(
        currentPriority,
        this.getWeight(),
        this.getColor(),
      );
    }
    return null;
  }
}
