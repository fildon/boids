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
        mouseAvoidRadius: 100,
        quantity: 200,
        repulsionRadius: 20,
        repulsionRadiusDefault: 20,
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
        quantity: 1,
        size: 8,
        visionRadius: 90,
    },
    screen: {
        // maxX and maxY are overwritten at run time
        // according to actual screen size
        maxX: 1000,
        maxY: 1000,
    },
};
