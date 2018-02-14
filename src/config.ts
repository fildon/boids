interface IConfig {
    alignmentRadius: number;
    attractionRadius: number;
    collisionRadius: number;
    maxSpeed: number;
    maxX: number;
    maxY: number;
    minSpeed: number;
    minX: number;
    minY: number;
    repulsionRadius: number;
    turningMax: number; // maximum rotation in radians per tick
}

export const config: IConfig = {
    alignmentRadius: 5,
    attractionRadius: 10,
    collisionRadius: 5,
    maxSpeed: 1.5,
    maxX: 90,
    maxY: 90,
    minSpeed: 0.5,
    minX: 10,
    minY: 10,
    repulsionRadius: 1,
    turningMax: 0.5,
};
