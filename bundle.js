(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
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

},{"./boid":2}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Boid = /** @class */ (function () {
    function Boid() {
        this.element = document.createElement("div");
        this.element.className = "boid";
        this.element.style.backgroundColor = Boid.randomColor();
        this.x = Math.random() * 100;
        this.y = Math.random() * 100;
    }
    ;
    Boid.prototype.move = function () {
        this.x = Math.min(Math.max(this.x + Boid.speed * (Math.random() - 0.5), 10), 90);
        this.y = Math.min(Math.max(this.y + Boid.speed * (Math.random() - 0.5), 10), 90);
        this.element.style.left = this.x + 'vw';
        this.element.style.top = this.y + 'vh';
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
