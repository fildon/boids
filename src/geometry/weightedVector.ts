import { Vector } from './vector';

export default class WeightedVector {
  public static average(weightedVectors: WeightedVector[]): Vector {
    if (weightedVectors.length === 0) {
      return new Vector();
    }
    const weightedAverage = weightedVectors.reduce((partial, current) => {
      return {
        vector: partial.vector.add(current.vector.scaleByScalar(current.weight)),
        weight: partial.weight + current.weight,
      };
    }, {
      vector: new Vector(),
      weight: 0,
    });

    return weightedAverage.vector.scaleByScalar(1 / weightedAverage.weight);
  }

  constructor(
    public vector: Vector = new Vector(),
    public weight: number = 0,
  ) {}
}
