interface IConfig {
    alignmentRadius: number;
    attractionRadius: number;
    boidQuantity: number;
    collisionRadius: number;
    maxHistory: number;
    maxSpeed: number;
    maxX: number;
    maxY: number;
    minSpeed: number;
    minX: number;
    minY: number;
    mouseRadius: number;
    repulsionRadius: number;
    turningMax: number; // maximum rotation in radians per tick
}

export const config: IConfig = {
    alignmentRadius: 40,
    attractionRadius: 100,
    boidQuantity: 100,
    collisionRadius: 25,
    maxHistory: 5,
    maxSpeed: 4,
    maxX: 1000,
    maxY: 1000,
    minSpeed: 3,
    minX: 0,
    minY: 0,
    mouseRadius: 50,
    repulsionRadius: 20,
    turningMax: 0.2,
};
