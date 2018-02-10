"use strict";
exports.__esModule = true;
var boid_1 = require("./boid");
function start() {
    var boids = [];
    for (var i = 0; i < 50; i++) {
        boids.push(new boid_1.Boid(document.getElementById('content')));
    }
    boids.map(function (boid) { return boid.start(); });
}
document.addEventListener("DOMContentLoaded", function () {
    start();
}, false);
