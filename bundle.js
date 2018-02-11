(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
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

},{"./boid":2}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Boid = /** @class */ (function () {
    function Boid(container) {
        this.element = document.createElement("div");
        this.attachToContainer(container);
        this.element.className = "boid";
        this.element.style.backgroundColor = Boid.randomColor();
        this.xPos = Math.random() * 80 + 10;
        this.yPos = Math.random() * 80 + 10;
        this.heading = Math.random() * 2 * Math.PI;
    }
    ;
    Boid.prototype.start = function () {
        this.move();
        (function (_this) {
            setTimeout(function () {
                _this.start();
            }, 1000 / 12);
        })(this);
    };
    Boid.prototype.move = function () {
        this.xPos += Boid.speed * Math.cos(this.heading);
        this.yPos += Boid.speed * Math.sin(this.heading);
        this.clipPosition();
        this.heading += Math.random() - 0.5;
        this.element.style.left = this.xPos + 'vw';
        this.element.style.top = this.yPos + 'vh';
    };
    Boid.prototype.clipPosition = function () {
        this.xPos = Math.min(Math.max(this.xPos, 10), 90);
        this.yPos = Math.min(Math.max(this.yPos, 10), 90);
    };
    Boid.prototype.attachToContainer = function (container) {
        container.insertAdjacentElement('beforeend', this.element);
    };
    Boid.randomColor = function () {
        var hue = Math.random() * 360;
        return 'hsl(' + hue + ", 100%, 50%)";
    };
    ;
    Boid.speed = 1;
    return Boid;
}());
exports.Boid = Boid;

},{}]},{},[1]);
