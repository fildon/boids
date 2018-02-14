interface IConfig {
    alignmentRadius: number;
    attractionRadius: number;
    repulsionRadius: number;
    speed: number;
    turningMax: number; // maximum rotation in radians per tick
}

export const config: IConfig = {
    alignmentRadius: 10,
    attractionRadius: 15,
    repulsionRadius: 5,
    speed: 1,
    turningMax: 0.5,
};
