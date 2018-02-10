export class Boid {
    x: number;
    y: number;
    element: HTMLElement;
    private static speed = 1;

    constructor() {
        this.element = document.createElement("div");
        this.element.style.height = '10px';
        this.element.style.width = '10px';
        this.element.style.backgroundColor = Boid.randomColor();
        this.element.style.position = 'absolute';
        this.x = Math.random() * 100;
        this.y = Math.random() * 100;
    };

    public move() {
        this.x = Math.min(Math.max(this.x + Boid.speed * (Math.random() - 0.5), 10), 90);
        this.y = Math.min(Math.max(this.y + Boid.speed * (Math.random() - 0.5), 10), 90);
        this.element.style.left = this.x + 'vw';
        this.element.style.top = this.y + 'vh';
    }

    private static randomColor() {
        var hue = Math.random() * 360;
        return 'hsl(' + hue + ", 100%, 50%)";
    };
}
