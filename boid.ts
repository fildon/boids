export class Boid {
    xPos: number;
    yPos: number;
    heading: number; // radians
    element: HTMLElement;
    private static speed = 1;

    constructor(container: HTMLElement) {
        this.element = document.createElement("div");
        this.attachToContainer(container);
        this.element.className = "boid";
        this.element.style.backgroundColor = Boid.randomColor();
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
        this.element.style.left = this.xPos + 'vw';
        this.element.style.top = this.yPos + 'vh';
    }

    private clipPosition() {
        this.xPos = Math.min(Math.max(this.xPos, 10), 90);
        this.yPos = Math.min(Math.max(this.yPos, 10), 90);
    }

    private attachToContainer(container: HTMLElement) {
        container.insertAdjacentElement('beforeend', this.element);
    }

    private static randomColor() {
        var hue = Math.random() * 360;
        return 'hsl(' + hue + ", 100%, 50%)";
    };
}
