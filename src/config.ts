export const config = {
  boid: {
    alignmentRadius: 40,
    alignmentRadiusDefault: 40,
    attractionRadius: 200,
    attractionRadiusDefault: 200,
    defaultColour: "LightSteelBlue",
    fearDuration: 30,
    maxSpeed: 6,
    minSpeed: 3,
    quantity: 100,
    repulsionRadius: 30,
    repulsionRadiusDefault: 30,
    size: 4,
    visionRadius: 200,
  },
  creature: {
    acceleration: 0.2,
    headingFuzz: 0.05,
    maxHistory: 5,
    turningMax: 0.2, // radians
  },
  hunter: {
    defaultColour: "yellow",
    eatRadius: 20,
    maxSpeed: 5,
    minSpeed: 4,
    quantity: 0,
    size: 8,
    visionRadius: 90,
  },
  player: {
    maxSpeed: 64,
    minSpeed: 0,
  },
  screen: {
    // maxX and maxY are overwritten at run time
    // according to actual screen size
    maxX: 1000,
    maxY: 1000,
  },
};
