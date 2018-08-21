export const config = {
    boid: {
        alignmentRadius: 0,
        alignmentRadiusDefault: 40,
        attractionRadius: 0,
        attractionRadiusDefault: 200,
        defaultColour: "LightSteelBlue",
        maxSpeed: 7,
        minSpeed: 4,
        mouseAvoidRadius: 0,
        quantity: 200,
        repulsionRadius: 0,
        repulsionRadiusDefault: 20,
        size: 4,
        visionRadius: 100,
    },
    creature: {
        acceleration: 0.2,
        headingFuzz: 0.05,
        maxHistory: 5,
        turningMax: 0.2, // radians
        wallAvoidRadius: 25,
    },
    hunter: {
        defaultColour: "yellow",
        eatRadius: 20,
        maxSpeed: 6,
        minSpeed: 5,
        quantity: 0,
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
