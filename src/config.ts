interface IConfig {
    attractionRadius: number;
    repulsionRadius: number;
    speed: number;
    turningMax: number; // maximum rotation in radians per tick
}

export const config: IConfig = {
    attractionRadius: 10,
    repulsionRadius: 5,
    speed: 1,
    turningMax: 0.5,
};
