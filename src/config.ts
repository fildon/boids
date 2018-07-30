export const config = {
    boid: {
        alignmentRadius: 40,
        attractionRadius: 100,
        maxSpeed: 6,
        minSpeed: 2,
        mouseAvoidRadius: 50,
        quantity: 150,
        repulsionRadius: 30,
        visionRadius: 40,
    },
    creature: {
        acceleration: 1,
        maxHistory: 5,
        turningMax: 0.2, // radians
        wallAvoidRadius: 25,
    },
    hunter: {
        eatRadius: 10,
        maxSpeed: 4,
        minSpeed: 2,
        quantity: 1,
        visionRadius: 80,
    },
    screen: {
        // maxX and maxY are overwritten at run time
        // according to actual screen size
        maxX: 1000,
        maxY: 1000,
    },
};
