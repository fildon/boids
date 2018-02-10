"use strict";
exports.__esModule = true;
var boid_1 = require("./boid");
function insertElement(element) {
    var content = document.getElementById('content');
    content.insertAdjacentElement('beforeend', element);
}
function start() {
    var boids = Array.apply(null, { length: 50 }).map(Function.call, new boid_1.Boid);
    boids.map(function (boid) { return insertElement(boid); });
    boids.map(function (boid) { return continualUpdate(boid); });
}
function continualUpdate(boid) {
    boid.move();
    setTimeout(function () {
        continualUpdate(boid);
    }, 1000 / 12);
}
