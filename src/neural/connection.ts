import { Neuron } from "./neuron";

export class Connection {
  private input: Neuron;
  private output: Neuron;
  private weight: number;

  constructor(input: Neuron, output: Neuron, weight: number = Math.random()) {
    this.input = input;
    this.output = output;
    this.weight = weight;
  }

  public getNormalizedOutput(): number {
    return 2 * this.input.value * this.weight;
  }
}
