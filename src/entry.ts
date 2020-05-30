import { SimulationManager } from './stateManagement/simulationManager';

document.addEventListener('DOMContentLoaded', () => {
  new SimulationManager().runSimulation();
}, false);
