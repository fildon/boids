import { Layer } from './layer';

export class Net {
  public readonly depth: number;
  public readonly width: number;
  public layers: Layer[]

  constructor(depth: number, width: number) {
    this.depth = depth;
    this.width = width;
    const inputLayer = new Layer(this.width)
    this.layers = [inputLayer]

    let priorLayer = inputLayer
    for (let i = 1; i < this.depth; i++) {
      const nextLayer = new Layer(this.width)
      nextLayer.connectPriorLayer(priorLayer)
      this.layers.push(nextLayer)
      priorLayer = nextLayer
    }
  }

  public processInput(inputVector: number[]): number[] {
    this.injectInputVectorToInputLayer(inputVector)
    for (let i = 1; i < this.depth; i++) {
      this.layers[i].updateValues()
    }
    return this.layers[this.depth - 1].outputVector()
  }

  private injectInputVectorToInputLayer(inputVector: number[]): void {
    this.layers[0].injectInputVector(inputVector)
  }
}
