"use strict";
exports.__esModule = true;
var Boid = /** @class */ (function () {
    function Boid(container) {
        this.color = Boid.randomColor();
        this.buildBody(container);
        this.buildBeak();
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
    Boid.prototype.buildBody = function (container) {
        this.body = document.createElement("div");
        this.attachToContainer(container);
        this.body.className = "boid";
        this.body.style.backgroundColor = this.color;
    };
    Boid.prototype.buildBeak = function () {
        this.beak = document.createElement("div");
        this.body.insertAdjacentElement('beforeend', this.beak);
        this.beak.className = "beak";
        this.beak.style.backgroundColor = this.color;
    };
    Boid.prototype.move = function () {
        this.xPos += Boid.speed * Math.cos(this.heading);
        this.yPos += Boid.speed * Math.sin(this.heading);
        this.clipPosition();
        this.heading += Math.random() - 0.5;
        this.body.style.left = this.xPos + 'vw';
        this.body.style.top = this.yPos + 'vh';
        this.beak.style.left = 4 * Math.cos(this.heading) + 2 + 'px';
        this.beak.style.top = 4 * Math.sin(this.heading) + 2 + 'px';
    };
    Boid.prototype.clipPosition = function () {
        this.xPos = Math.min(Math.max(this.xPos, 10), 90);
        this.yPos = Math.min(Math.max(this.yPos, 10), 90);
    };
    Boid.prototype.attachToContainer = function (container) {
        container.insertAdjacentElement('beforeend', this.body);
    };
    Boid.randomColor = function () {
        var hue = Math.random() * 360;
        return 'hsl(' + hue + ", 50%, 50%)";
    };
    ;
    Boid.speed = 1;
    return Boid;
}());
exports.Boid = Boid;
