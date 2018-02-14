import { BoidManager } from "./boidManager";

document.addEventListener("DOMContentLoaded", () => {
    new BoidManager(50).runSimulation();
}, false);
