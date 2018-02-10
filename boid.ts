export class Boid {
    x: number;
    y: number;
    element: HTMLElement;
    private static speed = 1;

    constructor(container: HTMLElement) {
        this.element = document.createElement("div");
        this.attachToContainer(container);
        this.element.className = "boid";
        this.element.style.backgroundColor = Boid.randomColor();
        this.x = Math.random() * 100;
        this.y = Math.random() * 100;
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
        this.x = Math.min(Math.max(this.x + Boid.speed * (Math.random() - 0.5), 10), 90);
        this.y = Math.min(Math.max(this.y + Boid.speed * (Math.random() - 0.5), 10), 90);
        this.element.style.left = this.x + 'vw';
        this.element.style.top = this.y + 'vh';
    }

    private attachToContainer(container: HTMLElement) {
        container.insertAdjacentElement('beforeend', this.element);
    }

    private static randomColor() {
        var hue = Math.random() * 360;
        return 'hsl(' + hue + ", 100%, 50%)";
    };
}
