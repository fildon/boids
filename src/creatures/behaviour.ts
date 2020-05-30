import WeightedVector from '../geometry/weightedVector';
import { Priority } from './priority';

export class Behaviour {
  constructor(
    public getIdealWeightedHeading: (() => WeightedVector),
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
