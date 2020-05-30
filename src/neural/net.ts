import { Layer } from './layer';

export class Net {
  public layers: Layer[]

  constructor(
    layerSizes: number[],
  ) {
    const inputLayer = new Layer(layerSizes[0]);
    this.layers = [inputLayer];

    let priorLayer = inputLayer;
    for (let i = 1; i < layerSizes.length; i++) {
      const nextLayer = new Layer(layerSizes[i]);
      nextLayer.connectPriorLayer(priorLayer);
      this.layers.push(nextLayer);
      priorLayer = nextLayer;
    }
  }

  public processInput(inputVector: number[]): number[] {
    this.injectInputVectorToInputLayer(inputVector);
    for (let i = 1; i < this.layers.length; i++) {
      this.layers[i].updateValues();
    }
    return this.layers[this.layers.length - 1].outputVector();
  }

  private injectInputVectorToInputLayer(inputVector: number[]): void {
    this.layers[0].injectInputVector(inputVector);
  }
}
