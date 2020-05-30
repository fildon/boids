import WeightedVector2 from "geometry/weightedVector2";
import { Priority } from "creatures/priority";

export class Behaviour {
  constructor(
    public getIdealWeightedHeading: (() => WeightedVector2),
    public getColor: () => string,
  ) {
  }
  public getCurrentPriority(): Priority | null {
    const weightedHeading = this.getIdealWeightedHeading();
    if (weightedHeading.weight > 0) {
      return new Priority(
        weightedHeading,
        this.getColor(),
      );
    }
    return null;
  }
}
