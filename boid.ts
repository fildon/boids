export class Boid {
    xPos: number;
    yPos: number;
    heading: number; // radians
    body: HTMLElement;
    beak: HTMLElement;
    private static speed = 1;

    constructor(container: HTMLElement) {
        this.body = this.buildBodyPart(Boid.randomColor(), "boid");
        container.insertAdjacentElement('beforeend', this.body);

        this.beak = this.buildBodyPart("black", "beak");
        this.body.insertAdjacentElement('beforeend', this.beak);

        this.xPos = Math.random() * 80 + 10;
        this.yPos = Math.random() * 80 + 10;
        this.heading = Math.random() * 2 * Math.PI;
    };

    public start() {
        this.move();
        ((_this) => {
            setTimeout(function() {
                _this.start();
            }, 1000 / 12);
        }) (this)
    }

    private buildBodyPart(color: string, className: string) {
        var bodyPart = document.createElement("div");
        bodyPart.className = className;
        bodyPart.style.backgroundColor = color;
        return bodyPart;
    }

    private move() {
        this.advancePosition();
        this.clipPosition();
        this.heading += Math.random() - 0.5;
        this.drawSelf();
    }

    private advancePosition() {
        this.xPos += Boid.speed * Math.cos(this.heading);
        this.yPos += Boid.speed * Math.sin(this.heading);
    }

    private drawSelf() {
        this.body.style.left = this.xPos + 'vw';
        this.body.style.top = this.yPos + 'vh';
        this.beak.style.left = 4 * Math.cos(this.heading) + 2 + 'px';
        this.beak.style.top = 4 * Math.sin(this.heading) + 2 + 'px';
    }

    private clipPosition() {
        this.xPos = Math.min(Math.max(this.xPos, 10), 90);
        this.yPos = Math.min(Math.max(this.yPos, 10), 90);
    }

    private static randomColor() {
        var hue = Math.random() * 360;
        return 'hsl(' + hue + ", 50%, 50%)";
    };
}
