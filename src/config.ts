export const config = {
    boid: {
        alignmentRadius: 40,
        attractionRadius: 200,
        defaultColour: "LightSteelBlue",
        maxSpeed: 9,
        minSpeed: 4,
        mouseAvoidRadius: 100,
        quantity: 1000,
        repulsionRadius: 20,
        size: 4,
        visionRadius: 100,
    },
    creature: {
        acceleration: 0.2,
        maxHistory: 5,
        turningMax: 0.2, // radians
        wallAvoidRadius: 25,
    },
    hunter: {
        defaultColour: "yellow",
        eatRadius: 20,
        maxSpeed: 6,
        minSpeed: 5,
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
