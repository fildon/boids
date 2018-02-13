import { Boid } from "./boid";

function start() {
    const boids: Boid[] = [];
    const boidContainer = document.getElementById("boid-container");
    if (!boidContainer) {
        throw new Error("couldn't find 'boid-container' on document");
    }
    for (let i = 0; i < 50; i++) {
        boids.push(new Boid(boidContainer, boids));
    }
    boids.map((boid) => boid.start());
}

document.addEventListener("DOMContentLoaded", () => {
    start();
}, false);
