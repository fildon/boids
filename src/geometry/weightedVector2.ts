import { Vector2 } from './vector2';

export default class WeightedVector2 {
  public static average(weightedVectors: WeightedVector2[]): Vector2 {
    if (weightedVectors.length === 0) {
      return new Vector2();
    }
    const weightedAverage = weightedVectors.reduce((partial, current) => {
      return {
        vector: partial.vector.add(current.vector.scaleByScalar(current.weight)),
        weight: partial.weight + current.weight,
      };
    }, {
      vector: new Vector2(),
      weight: 0,
    });

    return weightedAverage.vector.scaleByScalar(1 / weightedAverage.weight);
  }

  constructor(
    public vector: Vector2 = new Vector2(),
    public weight: number = 0,
  ) {}
}
