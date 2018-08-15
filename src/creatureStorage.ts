import { Creature } from "./creatures/creature";
import { Hunter } from "./creatures/hunter";
import { Boid } from "./creatures/boid";
import { Vector2 } from "./vector2";

export class CreatureStorage {
    private nextHunterId = 0;
    private hunters = new Map<number, Hunter>();
    private nextBoidId = 0;
    private boids = new Map<number, Boid>();

    public addHunter(): Hunter {
        const newHunter = new Hunter(
            this.nextHunterId,
            this,
        );
        this.hunters.set(this.nextHunterId, newHunter);
        this.nextHunterId++;
        return newHunter;
    }

    public addBoid(): Boid {
        const newBoid = new Boid(
            this.nextBoidId,
            this,
        );
        this.boids.set(this.nextBoidId, newBoid);
        this.nextBoidId++;
        return newBoid;
    }

    public getAllHunters(): IterableIterator<Hunter> {
        return this.hunters.values();
    }

    public getAllBoids(): IterableIterator<Boid> {
        return this.boids.values();
    }

    public getAllCreatures(): Creature[] {
        return [...this.getAllBoids(), ...this.getAllHunters()];
    }

    public getHuntersInArea(center: Vector2, radius: number): Hunter[] {
        return [...this.hunters.values()]
            .filter((hunter) => hunter.position.distance(center) < radius);
    }

    public getBoidsInArea(center: Vector2, radius: number): Boid[] {
        return [...this.boids.values()]
            .filter((boid) => boid.position.distance(center) < radius);
    }

    public getHunterCount(): number {
        return this.hunters.size;
    }

    public getBoidCount(): number {
        return this.boids.size;
    }

    public removeHunter(hunterId: number): void {
        this.hunters.delete(hunterId);
    }

    public removeBoid(boidId: number): void {
        this.boids.delete(boidId);
    }
}
