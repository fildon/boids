(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boid_1 = require("./boid");
function start() {
    var boids = [];
    var boidContainer = document.getElementById('boid-container');
    if (!boidContainer) {
        console.log("couldn't find 'boid-container' on document");
        return;
    }
    for (var i = 0; i < 50; i++) {
        boids.push(new boid_1.Boid(boidContainer, boids));
    }
    boids.map(boid => boid.start());
}
document.addEventListener("DOMContentLoaded", () => {
    start();
}, false);

},{"./boid":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector2_1 = require("./vector2");
class Boid {
    constructor(container, allBoids) {
        this.allBoids = allBoids;
        this.otherBoids = []; // This gets 'properly' intialized in the start method
        this.body = Boid.buildBodyPart(Boid.randomColor(), "boid");
        container.insertAdjacentElement('beforeend', this.body);
        this.beak = Boid.buildBodyPart("black", "beak");
        this.body.insertAdjacentElement('beforeend', this.beak);
        this.position = new vector2_1.Vector2(Math.random() * 80 + 10, Math.random() * 80 + 10);
        var heading = Math.random() * 2 * Math.PI;
        this.velocity = new vector2_1.Vector2(Boid.speed * Math.cos(heading), Boid.speed * Math.sin(heading));
    }
    ;
    start() {
        this.otherBoids = this.allBoids.filter(boid => boid !== this);
        this.move();
        ((thisCaptured) => {
            setTimeout(function () {
                thisCaptured.start();
            }, 1000 / 12);
        })(this);
    }
    static randomColor() {
        var hue = Math.random() * 360;
        return 'hsl(' + hue + ", 50%, 50%)";
    }
    static buildBodyPart(color, className) {
        var bodyPart = document.createElement("div");
        bodyPart.className = className;
        bodyPart.style.backgroundColor = color;
        return bodyPart;
    }
    move() {
        this.advancePosition();
        this.clipPosition();
        this.updateHeading();
        this.drawSelf();
    }
    advancePosition() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    clipPosition() {
        this.position.x = Math.min(Math.max(this.position.x, 10), 90);
        this.position.y = Math.min(Math.max(this.position.y, 10), 90);
    }
    updateHeading() {
        if (this.otherBoids.length > 0) {
            var nearestNeighbour = this.nearestNeighbour();
            if (this.distanceToBoid(nearestNeighbour) < Boid.repulsionRadius) {
                var relativeVectorTo = this.position.vectorTo(nearestNeighbour.position);
                this.velocity.rotateAwayFrom(relativeVectorTo, Boid.turningMax);
            }
        }
        this.velocity.rotate(2 * Boid.turningMax * Math.random() - Boid.turningMax);
    }
    nearestNeighbour() {
        return this.otherBoids.reduce((nearestBoid, currentBoid) => {
            var nearestDistance = this.distanceToBoid(nearestBoid);
            var currentDistance = this.distanceToBoid(currentBoid);
            return currentDistance < nearestDistance ? currentBoid : nearestBoid;
        });
    }
    distanceToBoid(boid) {
        return this.position.distance(boid.position);
    }
    neighbours(radius) {
        return this.otherBoids.filter(boid => this.position.distance(boid.position) < radius);
    }
    drawSelf() {
        this.body.style.left = this.position.x + 'vw';
        this.body.style.top = this.position.y + 'vh';
        this.beak.style.left = 4 * this.velocity.x + 2 + 'px';
        this.beak.style.top = 4 * this.velocity.y + 2 + 'px';
    }
}
Boid.repulsionRadius = 5;
Boid.speed = 1;
Boid.turningMax = 0.5; // maximum rotation in radians per tick
exports.Boid = Boid;

},{"./vector2":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    distance(v) {
        return Math.sqrt(Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2));
    }
    vectorTo(vector) {
        return new Vector2(vector.x - this.x, vector.y - this.y);
    }
    rotate(radians) {
        var xcopy = this.x;
        var ycopy = this.y;
        this.x = xcopy * Math.cos(radians) - ycopy * Math.sin(radians);
        this.y = xcopy * Math.sin(radians) + ycopy * Math.cos(radians);
    }
    rotateAwayFrom(vector, angle) {
        var relativeAngleFromVectorToThis = Math.atan2(vector.x * this.y - vector.y * this.x, vector.x * this.x + vector.y * this.y);
        if (relativeAngleFromVectorToThis > 0) {
            this.rotate(Math.min(Math.PI - relativeAngleFromVectorToThis, angle));
        }
        else {
            this.rotate(Math.max(-relativeAngleFromVectorToThis - Math.PI, -angle));
        }
    }
}
exports.Vector2 = Vector2;

},{}]},{},[1]);
