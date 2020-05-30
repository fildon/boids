import WeightedVector from '../geometry/weightedVector';

export class Priority {
  constructor(
    public weightedVector: WeightedVector,
    public color: string,
  ) {}
}
