function insertElement(element) {
    var content = document.getElementById('content');
    content.insertAdjacentElement('beforeend', element);
}

function createBoid() {
    var boid = document.createElement("div");
    boid.style.height = '10px';
    boid.style.width = '10px';
    boid.style.backgroundColor = randomColor();
    boid.style.position = 'absolute';
    boid.x = Math.random() * 100;
    boid.y = Math.random() * 100;
    return boid;
}

function randomColor() {
    var hue = Math.random() * 360;
    return 'hsl(' + hue + ", 100%, 50%)";
}

function randomFrom1toN(n) {
    return Math.floor((Math.random() * n) + 1);
}

function move(boid) {
    boid.x = Math.min(Math.max(boid.x + 1 * (Math.random() - 0.5), 10), 90);
    boid.y = Math.min(Math.max(boid.y + 1 * (Math.random() - 0.5), 10), 90);
    boid.style.left = boid.x + 'vw';
    boid.style.top = boid.y + 'vh';
}

function start() {
    var boids = Array.from({length: 100}, (x, i) => createBoid());
    boids.map(boid => insertElement(boid));
    boids.map(boid => continualUpdate(boid));
}

function continualUpdate(boid) {
    move(boid);
    setTimeout(function() {
        continualUpdate(boid);
    }, 1000 / 12);
}
