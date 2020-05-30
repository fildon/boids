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
    this.outputs.push(connection);
  }

  private connectInput(connection: Connection): void {
    this.inputs.push(connection);
  }

  static connectPair(prior: Neuron, next: Neuron): void {
    const connection = new Connection(prior, next);
    prior.connectOutput(connection);
    next.connectInput(connection);
  }

  // Activation function
  public updateValue(): void {
    this.step3Function();
  }

  private step2Function(): void {
    // This implementation is the classic step function
    const inputSum = this.inputs.reduce(
      (prev, curr) => prev + curr.getNormalizedOutput(),
      0
    );

    const averageInput = inputSum / this.inputs.length;
    this.value = averageInput < 0.5 ? 0 : 1;
  }

  private step3Function(): void {
    // Variant step function allow 3-state outputs
    const inputSum = this.inputs.reduce(
      (prev, curr) => prev + curr.getNormalizedOutput(),
      0
    );

    const averageInput = inputSum / this.inputs.length;
    if (averageInput < 1 / 3) {
      this.value = 0;
      return;
    }
    if (averageInput < 2 / 3) {
      this.value = 0.5;
      return;
    }
    this.value = 1;
  }
}
