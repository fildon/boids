import { Boid } from "./boid";

function insertElement(element: HTMLElement) {
    var content = document.getElementById('content');
    content.insertAdjacentElement('beforeend', element);
}

function continualUpdate(boid) {
    boid.move();
    setTimeout(function() {
        continualUpdate(boid);
    }, 1000 / 12);
}

function start() {
    console.log("started?");

    var boids: Array<Boid> = [];
    for (var i = 0; i < 50; i++) {
        boids.push(new Boid());
    }
    boids.map(boid => insertElement(boid.element));
    boids.map(boid => continualUpdate(boid));
}

document.addEventListener("DOMContentLoaded", () => {
    start();
}, false);
