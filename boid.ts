export class Boid {
    xPos: number;
    yPos: number;
    heading: number; // radians
    body: HTMLElement;
    beak: HTMLElement;
    color: string;
    private static speed = 1;

    constructor(container: HTMLElement) {
        this.color = Boid.randomColor();

        this.body = document.createElement("div");
        this.attachToContainer(container);
        this.body.className = "boid";
        this.body.style.backgroundColor = this.color;

        this.beak = document.createElement("div");
        this.body.insertAdjacentElement('beforeend', this.beak);
        this.beak.className = "beak";
        this.beak.style.backgroundColor = "black";

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

    private move() {
        this.xPos += Boid.speed * Math.cos(this.heading);
        this.yPos += Boid.speed * Math.sin(this.heading);
        this.clipPosition();
        this.heading += Math.random() - 0.5;
        this.body.style.left = this.xPos + 'vw';
        this.body.style.top = this.yPos + 'vh';
        this.beak.style.left = 4 * Math.cos(this.heading) + 2 + 'px';
        this.beak.style.top = 4 * Math.sin(this.heading) + 2 + 'px';
    }

    private clipPosition() {
        this.xPos = Math.min(Math.max(this.xPos, 10), 90);
        this.yPos = Math.min(Math.max(this.yPos, 10), 90);
    }

    private attachToContainer(container: HTMLElement) {
        container.insertAdjacentElement('beforeend', this.body);
    }

    private static randomColor() {
        var hue = Math.random() * 360;
        return 'hsl(' + hue + ", 50%, 50%)";
    };
}
