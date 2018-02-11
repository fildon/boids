import { Boid } from "./boid";

function start() {
    var boids: Array<Boid> = [];
    var contentContainer = document.getElementById('content');
    if (!contentContainer) {
        console.log("couldn't find 'content' on document");
        return;
    }
    for (var i = 0; i < 50; i++) {
        boids.push(new Boid(contentContainer));
    }
    boids.map(boid => boid.start());
}

document.addEventListener("DOMContentLoaded", () => {
    start();
}, false);
