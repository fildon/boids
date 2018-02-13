import { Vector2 } from "./vector2";

export class Boid {
    private static repulsionRadius = 5;
    private static speed = 1;
    private static turningMax = 0.5; // maximum rotation in radians per tick

    private static randomColor() {
        const hue = Math.random() * 360;
        return "hsl(" + hue + ", 50%, 50%)";
    }

    private static buildBodyPart(color: string, className: string) {
        const bodyPart = document.createElement("div");
        bodyPart.className = className;
        bodyPart.style.backgroundColor = color;
        return bodyPart;
    }

    private position: Vector2;
    private velocity: Vector2;
    private body: HTMLElement;
    private beak: HTMLElement;
    private allBoids: Boid[];
    private otherBoids: Boid[];

    constructor(container: HTMLElement, allBoids: Boid[]) {
        this.allBoids = allBoids;
        this.otherBoids = []; // This gets 'properly' intialized in the start method

        this.body = Boid.buildBodyPart("black", "boid");
        container.insertAdjacentElement("beforeend", this.body);

        this.beak = Boid.buildBodyPart("black", "beak");
        this.body.insertAdjacentElement("beforeend", this.beak);

        this.position = new Vector2(
            Math.random() * 80 + 10,
            Math.random() * 80 + 10,
        );

        const heading = Math.random() * 2 * Math.PI;
        this.velocity = new Vector2(
            Boid.speed * Math.cos(heading),
            Boid.speed * Math.sin(heading),
        );
    }

    public start() {
        this.otherBoids = this.allBoids.filter((boid) => boid !== this);
        this.move();
        ((thisCaptured) => {
            setTimeout(() => {
                thisCaptured.start();
            }, 1000 / 12);
        }) (this);
    }

    public nearestNeighbour(): Boid {
        return this.otherBoids.reduce((nearestBoid, currentBoid) => {
            const nearestDistance = this.distanceToBoid(nearestBoid);
            const currentDistance = this.distanceToBoid(currentBoid);
            return currentDistance < nearestDistance ? currentBoid : nearestBoid;
        });
    }

    public distanceToBoid(boid: Boid): number {
        return this.position.distance(boid.position);
    }

    private move() {
        this.position.add(this.velocity);
        this.position.clip(10, 90, 10, 90);
        this.updateHeading();
        this.drawSelf();
    }

    private updateHeading() {
        if (this.otherBoids.length > 0) {
            const nearestNeighbour = this.nearestNeighbour();
            if (this.distanceToBoid(nearestNeighbour) < Boid.repulsionRadius) {
                const relativeVectorTo = this.position.vectorTo(nearestNeighbour.position);
                this.velocity.rotateAwayFrom(relativeVectorTo, Boid.turningMax);
                this.body.style.backgroundColor = Boid.randomColor();
                return;
            }
        }
        this.body.style.backgroundColor = "grey";
        this.velocity.rotate(2 * Boid.turningMax * Math.random() - Boid.turningMax);
    }

    private neighbours(radius: number): Boid[] {
        return this.otherBoids.filter(
            (boid) => this.position.distance(boid.position) < radius,
        );
    }

    private drawSelf() {
        this.body.style.left = this.position.x + "vw";
        this.body.style.top = this.position.y + "vh";
        this.beak.style.left = 4 * this.velocity.x + 2 + "px";
        this.beak.style.top = 4 * this.velocity.y + 2 + "px";
    }
}
