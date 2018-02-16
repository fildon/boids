import { BoidManager } from "./boidManager";

document.addEventListener("DOMContentLoaded", () => {
    new BoidManager(100).runSimulation();
}, false);
