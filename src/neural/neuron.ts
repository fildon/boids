import { Connection } from "./connection";

export class Neuron {
  private inputs: Connection[];
  private outputs: Connection[];
  public value: number;

  constructor() {
    this.inputs = [];
    this.outputs = [];
    this.value = 0;
  }

  private connectOutput(connection: Connection): void {
    this.outputs.push(connection)
  }

  private connectInput(connection: Connection): void {
    this.inputs.push(connection)
  }

  static connectPair(prior: Neuron, next: Neuron): void {
    const connection = new Connection(prior, next)
    prior.connectOutput(connection)
    next.connectInput(connection)
  }

  // Activation function
  public updateValue(): void {
    // This implementation is the classic step function
    const inputSum = this.inputs.reduce(
      (prev, curr) => prev + curr.getWeightedOutput(),
      0
    )
    const averageInput = inputSum / this.inputs.length;
    this.value = averageInput < 0.5 ? 0 : 1;
  }
}
