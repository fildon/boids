import { Boid } from "./boid";

function start() {
    var boids: Array<Boid> = [];
    var boidContainer = document.getElementById('boid-container');
    if (!boidContainer) {
        console.log("couldn't find 'boid-container' on document");
        return;
    }
    for (var i = 0; i < 50; i++) {
        boids.push(new Boid(boidContainer, boids));
    }
    boids.map(boid => boid.start());
}

document.addEventListener("DOMContentLoaded", () => {
    start();
}, false);
