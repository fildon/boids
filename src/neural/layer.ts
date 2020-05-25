import { Neuron } from "./neuron"

export class Layer {
  public neurons: Neuron[]

  constructor(size: number) {
    this.neurons = []
    for (let i = 0; i < size; i++) {
      this.neurons.push(new Neuron())
    }
  }

  public connectPriorLayer(priorLayer: Layer): void {
    this.neurons.forEach(neuron => {
      priorLayer.neurons.forEach(priorNeuron => {
        Neuron.connectPair(priorNeuron, neuron)
      })
    })
  }

  public injectInputVector(inputVector: number[]): void {
    for (let i = 0; i < inputVector.length; i++) {
      this.neurons[i].value = inputVector[i]
    }
  }

  public updateValues(): void {
    this.neurons.forEach(neuron => neuron.updateValue())
  }

  public outputVector(): number[] {
    return this.neurons.map(neuron => neuron.value)
  }
}
