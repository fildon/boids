interface IConfig {
    alignmentRadius: number;
    attractionRadius: number;
    collisionRadius: number;
    maxX: number;
    maxY: number;
    minX: number;
    minY: number;
    repulsionRadius: number;
    speed: number;
    turningMax: number; // maximum rotation in radians per tick
}

export const config: IConfig = {
    alignmentRadius: 10,
    attractionRadius: 15,
    collisionRadius: 5,
    maxX: 90,
    maxY: 90,
    minX: 10,
    minY: 10,
    repulsionRadius: 5,
    speed: 1,
    turningMax: 0.5,
};
