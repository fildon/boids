(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boid_1 = require("./boid");
function start() {
    const boids = [];
    const boidContainer = document.getElementById("boid-container");
    if (!boidContainer) {
        throw new Error("couldn't find 'boid-container' on document");
    }
    for (let i = 0; i < 50; i++) {
        boids.push(new boid_1.Boid(boidContainer, boids));
    }
    boids.map((boid) => boid.start());
}
document.addEventListener("DOMContentLoaded", () => {
    start();
}, false);

},{"./boid":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const vector2_1 = require("./vector2");
class Boid {
    static randomColor() {
        const hue = Math.random() * 360;
        return "hsl(" + hue + ", 50%, 50%)";
    }
    static buildBodyPart(color, className) {
        const bodyPart = document.createElement("div");
        bodyPart.className = className;
        bodyPart.style.backgroundColor = color;
        return bodyPart;
    }
    constructor(container, allBoids) {
        this.allBoids = allBoids;
        this.otherBoids = []; // This gets 'properly' intialized in the start method
        this.body = Boid.buildBodyPart("black", "boid");
        container.insertAdjacentElement("beforeend", this.body);
        this.beak = Boid.buildBodyPart("black", "beak");
        this.body.insertAdjacentElement("beforeend", this.beak);
        this.position = new vector2_1.Vector2(Math.random() * 80 + 10, Math.random() * 80 + 10);
        const heading = Math.random() * 2 * Math.PI;
        this.velocity = new vector2_1.Vector2(config_1.config.speed * Math.cos(heading), config_1.config.speed * Math.sin(heading));
    }
    start() {
        this.otherBoids = this.allBoids.filter((boid) => boid !== this);
        this.move();
        ((thisCaptured) => {
            setTimeout(() => {
                thisCaptured.start();
            }, 1000 / 12);
        })(this);
    }
    nearestNeighbour() {
        return this.otherBoids.reduce((nearestBoid, currentBoid) => {
            const nearestDistance = this.distanceToBoid(nearestBoid);
            const currentDistance = this.distanceToBoid(currentBoid);
            return currentDistance < nearestDistance ? currentBoid : nearestBoid;
        });
    }
    distanceToBoid(boid) {
        return this.position.distance(boid.position);
    }
    move() {
        this.position.add(this.velocity);
        this.position.clip(10, 90, 10, 90);
        this.updateHeading();
        this.drawSelf();
    }
    updateHeading() {
        if (this.otherBoids.length > 0) {
            const nearestNeighbour = this.nearestNeighbour();
            if (this.distanceToBoid(nearestNeighbour) < config_1.config.repulsionRadius) {
                const relativeVectorTo = this.position.vectorTo(nearestNeighbour.position);
                this.velocity.rotateAwayFrom(relativeVectorTo, config_1.config.turningMax);
                this.body.style.backgroundColor = Boid.randomColor();
                return;
            }
        }
        this.body.style.backgroundColor = "grey";
        this.velocity.rotate(2 * config_1.config.turningMax * Math.random() - config_1.config.turningMax);
    }
    neighbours(radius) {
        return this.otherBoids.filter((boid) => this.position.distance(boid.position) < radius);
    }
    drawSelf() {
        this.body.style.left = this.position.x + "vw";
        this.body.style.top = this.position.y + "vh";
        this.beak.style.left = 4 * this.velocity.x + 2 + "px";
        this.beak.style.top = 4 * this.velocity.y + 2 + "px";
    }
}
exports.Boid = Boid;

},{"./config":3,"./vector2":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    repulsionRadius: 5,
    speed: 1,
    turningMax: 0.5,
};

},{}],4:[function(require,module,exports){
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
        const xcopy = this.x;
        const ycopy = this.y;
        this.x = xcopy * Math.cos(radians) - ycopy * Math.sin(radians);
        this.y = xcopy * Math.sin(radians) + ycopy * Math.cos(radians);
        return this;
    }
    rotateAwayFrom(vector, angle) {
        const relativeAngleFromVectorToThis = Math.atan2(vector.x * this.y - vector.y * this.x, vector.x * this.x + vector.y * this.y);
        if (relativeAngleFromVectorToThis > 0) {
            this.rotate(Math.min(Math.PI - relativeAngleFromVectorToThis, angle));
        }
        else {
            this.rotate(Math.max(-relativeAngleFromVectorToThis - Math.PI, -angle));
        }
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }
    clip(xMin, xMax, yMin, yMax) {
        this.x = Math.min(Math.max(this.x, xMin), xMax);
        this.y = Math.min(Math.max(this.y, yMin), yMax);
    }
    equals(v) {
        return this.x === v.x && this.y === v.y;
    }
}
exports.Vector2 = Vector2;

},{}]},{},[1]);
