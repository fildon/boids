import { Boid } from "./boid";

export class Canvas {
    public static randomColor() {
        const hue = Math.random() * 360;
        return "hsl(" + hue + ", 50%, 50%)";
    }

    private canvas: HTMLElement;

    constructor(canvasElement: HTMLElement) {
        this.canvas = canvasElement;
    }

    public addElement(element: HTMLElement) {
        this.canvas.insertAdjacentElement("beforeend", element);
    }

    public update(boids: Boid[]): void {
        boids.forEach((boid) => {
            this.updateBoid(boid);
        });
    }

    public updateBoid(boid: Boid): void {
        if (!boid.body) {
            boid.body = this.buildBodyPart(Canvas.randomColor(), "boid");
            this.canvas.insertAdjacentElement("beforeend", boid.body);
        }
        if (!boid.beak) {
            boid.beak = this.buildBodyPart("black", "beak");
            boid.body.insertAdjacentElement("beforeend", boid.beak);
        }
        boid.body.style.left = boid.position.x + "vw";
        boid.body.style.top = boid.position.y + "vh";
        boid.beak.style.left = 4 * boid.velocity.x + 2 + "px";
        boid.beak.style.top = 4 * boid.velocity.y + 2 + "px";
    }

    public buildBodyPart(color: string, className: string) {
        const bodyPart = document.createElement("div");
        bodyPart.className = className;
        bodyPart.style.backgroundColor = color;
        return bodyPart;
    }
}
