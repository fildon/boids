"use strict";
exports.__esModule = true;
var boid_1 = require("./boid");
function insertElement(element) {
    var content = document.getElementById('content');
    content.insertAdjacentElement('beforeend', element);
}
function continualUpdate(boid) {
    boid.move();
    setTimeout(function () {
        continualUpdate(boid);
    }, 1000 / 12);
}
function start() {
    console.log("started?");
    var boids = [];
    for (var i = 0; i < 50; i++) {
        boids.push(new boid_1.Boid());
    }
    boids.map(function (boid) { return insertElement(boid.element); });
    boids.map(function (boid) { return continualUpdate(boid); });
}
document.addEventListener("DOMContentLoaded", function () {
    start();
}, false);
