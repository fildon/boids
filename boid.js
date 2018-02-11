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
