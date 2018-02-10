import { Boid } from "./boid";

function insertElement(element) {
    var content = document.getElementById('content');
    content.insertAdjacentElement('beforeend', element);
}

function start() {
    var boids = Array.apply(null, {length: 50}).map(Function.call, new Boid);
    boids.map(boid => insertElement(boid));
    boids.map(boid => continualUpdate(boid));
}

function continualUpdate(boid) {
    boid.move();
    setTimeout(function() {
        continualUpdate(boid);
    }, 1000 / 12);
}
