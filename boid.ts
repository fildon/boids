import { Vector2 } from "./vector2";

export class Boid {
    position: Vector2;
    velocity: Vector2;
    body: HTMLElement;
    beak: HTMLElement;
    allBoids: Array<Boid>;
    otherBoids: Array<Boid>;
    private static repulsionRadius = 5;
    private static speed = 1;
    private static turningMax = 0.5; // maximum rotation in radians per tick

    constructor(container: HTMLElement, allBoids: Array<Boid>) {
        this.allBoids = allBoids;
        this.otherBoids = []; // This gets 'properly' intialized in the start method

        this.body = Boid.buildBodyPart(Boid.randomColor(), "boid");
        container.insertAdjacentElement('beforeend', this.body);

        this.beak = Boid.buildBodyPart("black", "beak");
        this.body.insertAdjacentElement('beforeend', this.beak);

        this.position = new Vector2(
            Math.random() * 80 + 10,
            Math.random() * 80 + 10
        );

        var heading = Math.random() * 2 * Math.PI;
        this.velocity = new Vector2(
            Boid.speed * Math.cos(heading),
            Boid.speed * Math.sin(heading)
        );
    };

    public start() {
        this.otherBoids = this.allBoids.filter(boid => boid !== this);
        this.move();
        ((thisCaptured) => {
            setTimeout(function() {
                thisCaptured.start();
            }, 1000 / 12);
        }) (this)
    }

    private static randomColor() {
        var hue = Math.random() * 360;
        return 'hsl(' + hue + ", 50%, 50%)";
    }

    private static buildBodyPart(color: string, className: string) {
        var bodyPart = document.createElement("div");
        bodyPart.className = className;
        bodyPart.style.backgroundColor = color;
        return bodyPart;
    }

    private move() {
        this.advancePosition();
        this.clipPosition();
        this.updateHeading();
        this.drawSelf();
    }

    private advancePosition() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    private clipPosition() {
        this.position.x = Math.min(Math.max(this.position.x, 10), 90);
        this.position.y = Math.min(Math.max(this.position.y, 10), 90);
    }

    private updateHeading() {
        if (this.otherBoids.length > 0) {
            var nearestNeighbour = this.nearestNeighbour();
            if (this.distanceToBoid(nearestNeighbour) < Boid.repulsionRadius) {
                var relativeVectorTo = this.position.vectorTo(nearestNeighbour.position);
                this.velocity.rotateAwayFrom(relativeVectorTo, Boid.turningMax);
                return;
            }
        }
        this.velocity.rotate(2 * Boid.turningMax * Math.random() - Boid.turningMax);
    }

    public nearestNeighbour(): Boid {
        return this.otherBoids.reduce((nearestBoid, currentBoid) => {
            var nearestDistance = this.distanceToBoid(nearestBoid);
            var currentDistance = this.distanceToBoid(currentBoid);
            return currentDistance < nearestDistance ? currentBoid : nearestBoid;
        });
    }

    public distanceToBoid(boid: Boid): number {
        return this.position.distance(boid.position);
    }

    private neighbours(radius: number): Array<Boid> {
        return this.otherBoids.filter(
            boid => this.position.distance(boid.position) < radius
        );
    }

    private drawSelf() {
        this.body.style.left = this.position.x + 'vw';
        this.body.style.top = this.position.y + 'vh';
        this.beak.style.left = 4 * this.velocity.x + 2 + 'px';
        this.beak.style.top = 4 * this.velocity.y + 2 + 'px';
    }
}
