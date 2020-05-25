import { Neuron } from "./neuron";

export class Connection {
  private input: Neuron;
  private output: Neuron;
  private weight: number;

  constructor(input: Neuron, output: Neuron, weight: number = 2 * Math.random() - 1) {
    this.input = input;
    this.output = output;
    this.weight = weight;
  }

  public getWeightedOutput(): number {
    return this.input.value * this.weight
  }
}
