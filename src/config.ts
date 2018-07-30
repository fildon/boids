export const config = {
    boid: {
        alignmentRadius: 40,
        attractionRadius: 100,
        defaultColour: "LightSteelBlue",
        maxSpeed: 12,
        minSpeed: 4,
        mouseAvoidRadius: 50,
        quantity: 150,
        repulsionRadius: 30,
        size: 4,
        visionRadius: 80,
    },
    creature: {
        acceleration: 1,
        maxHistory: 5,
        turningMax: 0.2, // radians
        wallAvoidRadius: 25,
    },
    hunter: {
        defaultColour: "black",
        eatRadius: 10,
        maxSpeed: 8,
        minSpeed: 4,
        quantity: 1,
        size: 8,
        visionRadius: 80,
    },
    screen: {
        // maxX and maxY are overwritten at run time
        // according to actual screen size
        maxX: 1000,
        maxY: 1000,
    },
};
