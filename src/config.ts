interface IConfig {
    repulsionRadius: number;
    speed: number;
    turningMax: number; // maximum rotation in radians per tick
}

export const config: IConfig = {
    repulsionRadius: 5,
    speed: 1,
    turningMax: 0.5,
};
