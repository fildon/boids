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
