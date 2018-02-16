interface IConfig {
    alignmentRadius: number;
    attractionRadius: number;
    boidQuantity: number;
    collisionRadius: number;
    maxSpeed: number;
    maxX: number;
    maxY: number;
    minSpeed: number;
    minX: number;
    minY: number;
    repulsionRadius: number;
    tickRate: number;
    turningMax: number; // maximum rotation in radians per tick
}

export const config: IConfig = {
    alignmentRadius: 40,
    attractionRadius: 100,
    boidQuantity: 100,
    collisionRadius: 25,
    maxSpeed: 10,
    maxX: 1000,
    maxY: 1000,
    minSpeed: 7,
    minX: 0,
    minY: 0,
    repulsionRadius: 10,
    tickRate: 24,
    turningMax: 0.5,
};
