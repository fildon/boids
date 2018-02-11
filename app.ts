import { Boid } from "./boid";

function start() {
    var boids: Array<Boid> = [];
    for (var i = 0; i < 50; i++) {
        boids.push(new Boid(document.getElementById('content')));
    }
    boids.map(boid => boid.start());
}

document.addEventListener("DOMContentLoaded", () => {
    start();
}, false);