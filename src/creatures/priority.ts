import { Vector2 } from "../vector2";

export class Priority {
  constructor(
    public vector: Vector2,
    public weight: number,
    public color: string,
  ) {}
}
