import { Vector2 } from "./vector2";

export class Boid {
    position: Vector2;
    heading: number; // radians
    body: HTMLElement;
    beak: HTMLElement;
    allBoids: Array<Boid>;
    private static repulsionRadius = 1;
    private static speed = 1;

    constructor(container: HTMLElement, allBoids: Array<Boid>) {
        this.allBoids = allBoids;

        this.body = Boid.buildBodyPart(Boid.randomColor(), "boid");
        container.insertAdjacentElement('beforeend', this.body);

        this.beak = Boid.buildBodyPart("black", "beak");
        this.body.insertAdjacentElement('beforeend', this.beak);

        this.position = new Vector2(
            Math.random() * 80 + 10,
            Math.random() * 80 + 10
        );

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
        this.position.x += Boid.speed * Math.cos(this.heading);
        this.position.y += Boid.speed * Math.sin(this.heading);
    }

    private clipPosition() {
        this.position.x = Math.min(Math.max(this.position.x, 10), 90);
        this.position.y = Math.min(Math.max(this.position.y, 10), 90);
    }

    private updateHeading() {
        var nearestNeighbour = nearestNeighbour();
        if (nearestNeighbour.position.distance(this.position) < Boid.repulsionRadius) {
            // Be repelled ?
        } else {
            this.heading += Math.random() - 0.5;
        }
    }

    private nearestNeighbour(): Boid {
        var nearestBoid = this.allBoids[0];
        var nearestDist = this.allBoids[0].position.distance(this.position);
        var currentDist;
        this.allBoids.forEach(boid => {
            if (boid === this) {
                return;
            }
            currentDist = boid.position.distance(this.position);
            if (currentDist < nearestDist) {
                nearestBoid = boid;
                nearestDist = currentDist;
            }
        });
        return nearestBoid;
    }

    private neighbours(radius: number): Array<Boid> {
        return this.allBoids.filter(
            boid => {
                return boid !== this && 
                this.position.distance(boid.position) < radius
            }
        );
    }

    private drawSelf() {
        this.body.style.left = this.position.x + 'vw';
        this.body.style.top = this.position.y + 'vh';
        this.beak.style.left = 4 * Math.cos(this.heading) + 2 + 'px';
        this.beak.style.top = 4 * Math.sin(this.heading) + 2 + 'px';
    }
}
