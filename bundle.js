(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simulationManager_1 = require("./simulationManager");
document.addEventListener("DOMContentLoaded", () => {
    new simulationManager_1.SimulationManager().runSimulation();
}, false);

},{"./simulationManager":14}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const vector2_1 = require("./vector2");
class Canvas {
    constructor(canvasElement) {
        this.cameraPosition = new vector2_1.Vector2(window.innerWidth, window.innerHeight);
        this.canvas = canvasElement;
        const context = this.canvas.getContext("2d");
        if (!context) {
            throw new Error("could not get canvas context");
        }
        else {
            this.ctx = context;
        }
        this.canvas.height = config_1.config.screen.maxY;
        this.canvas.width = config_1.config.screen.maxX;
        this.setScreenSize();
    }
    onclick(callback) {
        this.canvas.onclick = callback;
    }
    setScreenSize() {
        if (window) {
            config_1.config.screen.maxX = window.innerWidth;
            config_1.config.screen.maxY = window.innerHeight;
        }
        this.ctx.canvas.width = config_1.config.screen.maxX;
        this.ctx.canvas.height = config_1.config.screen.maxY;
    }
    draw(creatures, cameraPosition) {
        this.cameraPosition = cameraPosition;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.setScreenSize();
        this.drawGhosts(creatures);
        creatures.forEach((creature) => {
            this.drawCreature(creature);
        });
    }
    drawGhosts(creatures) {
        if (!config_1.config.creature.maxHistory) {
            return;
        }
        for (let i = 0; i < config_1.config.creature.maxHistory; i++) {
            creatures.forEach((creature) => {
                this.drawGhost(creature, i);
            });
        }
    }
    drawGhost(creature, historyIndex) {
        this.drawCreatureBody(creature, historyIndex);
    }
    drawCreature(creature) {
        this.drawCreatureBody(creature);
        this.drawCreatureBeak(creature);
    }
    getPositionInCameraSpace(position) {
        return position
            .add(new vector2_1.Vector2(window.innerWidth / 2, window.innerHeight / 2))
            .subtract(this.cameraPosition)
            .normalize();
    }
    getPositionInWorldSpace(position) {
        return position
            .subtract(new vector2_1.Vector2(window.innerWidth / 2, window.innerHeight / 2))
            .add(this.cameraPosition)
            .normalize();
    }
    drawCreatureBody(creature, historyIndex) {
        let position = historyIndex ? creature.history[historyIndex] : creature.position;
        position = this.getPositionInCameraSpace(position);
        const radius = historyIndex ?
            creature.size * ((historyIndex + 1) / (config_1.config.creature.maxHistory + 1)) :
            creature.size;
        this.ctx.beginPath();
        this.ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = creature.colour;
        this.ctx.fill();
    }
    drawCreatureBeak(creature) {
        const position = this.getPositionInCameraSpace(creature.position);
        this.ctx.beginPath();
        this.ctx.arc(position.x + (creature.size + 1) * Math.cos(creature.heading), position.y + (creature.size + 1) * Math.sin(creature.heading), creature.size / 2, 0, 2 * Math.PI);
        this.ctx.fillStyle = "black";
        this.ctx.fill();
    }
}
exports.Canvas = Canvas;

},{"./config":3,"./vector2":15}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    boid: {
        alignmentRadius: 40,
        alignmentRadiusDefault: 40,
        attractionRadius: 200,
        attractionRadiusDefault: 200,
        defaultColour: "LightSteelBlue",
        fearDuration: 30,
        maxSpeed: 6,
        minSpeed: 3,
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
        turningMax: 0.2,
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

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hunter_1 = require("./creatures/hunter");
const boid_1 = require("./creatures/boid");
const config_1 = require("./config");
const playerFish_1 = require("./creatures/playerFish");
class CreatureStorage {
    constructor(inputHandler) {
        this.inputHandler = inputHandler;
        this.nextId = 0;
        this.creatures = new Map();
        this.bucketMap = [];
        this.bucketColumns = 1;
        this.bucketRows = 1;
        this.bucketSize = 100;
        this.update();
    }
    update() {
        this.resetBucketMap();
        this.creatures.forEach((creature) => {
            const bucketX = Math.min(Math.floor(creature.position.x / this.bucketSize), this.bucketColumns - 1);
            const bucketY = Math.min(Math.floor(creature.position.y / this.bucketSize), this.bucketRows - 1);
            this.bucketMap[bucketX][bucketY].push(creature);
        });
    }
    addHunter(position) {
        const newHunter = new hunter_1.Hunter(this.nextId, this, position);
        this.creatures.set(this.nextId, newHunter);
        this.nextId++;
        return newHunter;
    }
    addBoid(position) {
        const newBoid = new boid_1.Boid(this.nextId, this, position);
        this.creatures.set(this.nextId, newBoid);
        this.nextId++;
        return newBoid;
    }
    addPlayerFish() {
        const newPlayer = new playerFish_1.default(this.inputHandler);
        this.creatures.set(this.nextId, newPlayer);
        this.nextId++;
        return newPlayer;
    }
    getAllHunters() {
        return [...this.creatures.values()].filter((creature) => {
            return creature instanceof hunter_1.Hunter;
        });
    }
    getAllBoids() {
        return [...this.creatures.values()].filter((creature) => {
            return creature instanceof boid_1.Boid;
        });
    }
    getAllCreatures() {
        return [...this.creatures.values()];
    }
    getHuntersInArea(center, radius) {
        return this.getCreaturesInArea(center, radius)
            .filter((creature) => {
            return creature instanceof hunter_1.Hunter &&
                creature.position.distance(center) < radius;
        });
    }
    getBoidsInArea(center, radius) {
        return this.getCreaturesInArea(center, radius)
            .filter((creature) => {
            return creature instanceof boid_1.Boid &&
                creature.position.distance(center) < radius;
        });
    }
    getBoidsOrPlayersInArea(center, radius) {
        return this.getCreaturesInArea(center, radius)
            .filter((creature) => {
            return ((creature instanceof boid_1.Boid || creature instanceof playerFish_1.default) &&
                creature.position.distance(center) < radius);
        });
    }
    getCreaturesInArea(center, radius) {
        const bucketX = Math.floor(center.x / this.bucketSize);
        const bucketY = Math.floor(center.y / this.bucketSize);
        const bucketRadius = Math.ceil(radius / this.bucketSize);
        const minX = (bucketX - bucketRadius + this.bucketColumns) % this.bucketColumns;
        const maxX = (bucketX + bucketRadius + 1) % this.bucketColumns;
        const minY = (bucketY - bucketRadius + this.bucketRows) % this.bucketRows;
        const maxY = (bucketY + bucketRadius + 1) % this.bucketRows;
        let creatures = [];
        for (let i = minX; i !== maxX; i++, i = i % this.bucketColumns) {
            for (let j = minY; j !== maxY; j++, j = j % this.bucketRows) {
                creatures = creatures.concat(this.bucketMap[i][j]);
            }
        }
        return creatures;
    }
    getHunterCount() {
        return this.getAllHunters().length;
    }
    getBoidCount() {
        return this.getAllBoids().length;
    }
    remove(creatureId) {
        this.creatures.delete(creatureId);
    }
    resetBucketMap() {
        this.bucketMap = [];
        this.bucketColumns = Math.ceil(config_1.config.screen.maxX / this.bucketSize);
        this.bucketRows = Math.ceil(config_1.config.screen.maxY / this.bucketSize);
        for (let i = 0; i < this.bucketColumns; i++) {
            const bucketRow = [];
            for (let j = 0; j < this.bucketRows; j++) {
                bucketRow.push([]);
            }
            this.bucketMap.push(bucketRow);
        }
    }
}
exports.CreatureStorage = CreatureStorage;

},{"./config":3,"./creatures/boid":7,"./creatures/hunter":9,"./creatures/playerFish":10}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const priority_1 = require("./priority");
class Behaviour {
    constructor(getIdealHeading, getColor) {
        this.getIdealHeading = getIdealHeading;
        this.getColor = getColor;
    }
    getCurrentPriority() {
        const currentPriority = this.getIdealHeading();
        if (currentPriority) {
            return new priority_1.Priority(currentPriority, this.getColor());
        }
        return null;
    }
}
exports.Behaviour = Behaviour;

},{"./priority":11}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const vector2_1 = require("../vector2");
const creature_1 = require("./creature");
class BehaviourControlledCreature extends creature_1.Creature {
    constructor(id = 0, creatureStorage, position) {
        super();
        this.id = id;
        this.creatureStorage = creatureStorage;
        this.colour = "black";
        this.history = [];
        this.position = position || new vector2_1.Vector2(Math.random() * config_1.config.screen.maxX, Math.random() * config_1.config.screen.maxY);
        for (let i = 0; i < config_1.config.creature.maxHistory; i++) {
            this.history.push(this.position);
        }
        this.initializeVelocity();
    }
    distanceToCreature(creature) {
        return this.position.distance(creature.position);
    }
    move() {
        this.updateHistory();
        this.position = this.position.add(this.velocity()).normalize();
        this.updateHeading();
    }
    updateHeading() {
        const priority = this.getCurrentPriorityOrNull();
        if (priority) {
            this.updateHeadingTowards(priority.idealHeading);
            this.colour = priority.color;
            return;
        }
        this.defaultBehaviour();
    }
    getCurrentPriorityOrNull() {
        for (const priority of this.priorities) {
            const priorityNow = priority.getCurrentPriority();
            if (priorityNow) {
                return priorityNow;
            }
        }
        return null;
    }
    defaultBehaviour() {
        this.colour = this.defaultColour;
        this.speed = Math.max(this.velocity.length - config_1.config.creature.acceleration, this.minSpeed);
        const randomTurn = 2 * config_1.config.creature.turningMax * Math.random() - config_1.config.creature.turningMax;
        this.heading = this.heading + randomTurn;
    }
    updateHeadingTowards(vector) {
        if (!vector) {
            return;
        }
        let limitedSpeed = Math.max(Math.min(vector.length, this.maxSpeed), this.minSpeed);
        limitedSpeed = Math.max(Math.min(limitedSpeed, this.speed + config_1.config.creature.acceleration), this.speed - config_1.config.creature.acceleration);
        this.speed = limitedSpeed;
        const idealTurn = this.velocity().angleTo(vector);
        const limitedTurn = Math.max(Math.min(idealTurn, config_1.config.creature.turningMax), -config_1.config.creature.turningMax);
        this.heading = this.heading
            + limitedTurn
            + 2 * config_1.config.creature.headingFuzz * Math.random() - config_1.config.creature.headingFuzz;
        return;
    }
}
exports.BehaviourControlledCreature = BehaviourControlledCreature;

},{"../config":3,"../vector2":15,"./creature":8}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const vector2_1 = require("../vector2");
const behaviour_1 = require("./behaviour");
const staticTools_1 = require("./staticTools");
const behaviourControlledCreature_1 = require("./behaviourControlledCreature");
class Boid extends behaviourControlledCreature_1.BehaviourControlledCreature {
    constructor() {
        super(...arguments);
        this.defaultColour = config_1.config.boid.defaultColour;
        this.maxSpeed = config_1.config.boid.maxSpeed;
        this.minSpeed = config_1.config.boid.minSpeed;
        this.size = config_1.config.boid.size;
        this.fearCountdown = 0;
        this.heading = 2 * Math.PI * Math.random();
        this.speed = config_1.config.boid.maxSpeed;
        this.priorities = [
            new behaviour_1.Behaviour(() => this.hunterEvasionVector(), () => "red"),
            new behaviour_1.Behaviour(() => this.repulsionVector(), () => this.fearCountdown ? "red" : "orange"),
            new behaviour_1.Behaviour(() => this.alignmentVector(), () => this.fearCountdown ? "red" : "blue"),
            new behaviour_1.Behaviour(() => this.attractionVector(), () => this.fearCountdown ? "red" : "green"),
        ];
    }
    initializeVelocity() {
        this.heading = Math.random() * 2 * Math.PI;
        this.speed = config_1.config.boid.maxSpeed;
    }
    update() {
        if (this.fearCountdown) {
            this.fearCountdown--;
        }
        this.move();
    }
    hunterEvasionVector() {
        const huntersInSight = this.creatureStorage.getHuntersInArea(this.position, config_1.config.boid.visionRadius).filter((hunter) => {
            return Math.random() < hunter.chanceToSee(this.position, config_1.config.boid.visionRadius);
        });
        if (huntersInSight.length === 0) {
            return null;
        }
        this.fearCountdown = config_1.config.boid.fearDuration;
        const nearestHunter = staticTools_1.StaticTools
            .nearestCreatureToPosition(huntersInSight, this.position);
        return nearestHunter.position
            .vectorTo(this.position)
            .scaleToLength(this.maxSpeed);
    }
    repulsionVector() {
        const neighbours = this.creatureStorage.getBoidsOrPlayersInArea(this.position, config_1.config.boid.repulsionRadius).filter((boid) => boid !== this);
        if (neighbours.length === 0) {
            return null;
        }
        return vector2_1.Vector2.average(neighbours.map((creature) => {
            return creature.position.vectorTo(this.position);
        })).scaleToLength(this.fearCountdown
            ? this.maxSpeed
            : this.speed * 0.9);
    }
    alignmentVector() {
        const neighbours = this.creatureStorage.getBoidsOrPlayersInArea(this.position, config_1.config.boid.alignmentRadius).filter((boid) => boid !== this);
        if (neighbours.length === 0) {
            return null;
        }
        const averageAlignmentVector = vector2_1.Vector2.average(neighbours.map((creature) => {
            return creature.velocity();
        }));
        if (this.fearCountdown) {
            return averageAlignmentVector.scaleToLength(this.maxSpeed);
        }
        return averageAlignmentVector;
    }
    attractionVector() {
        const neighbours = this.creatureStorage.getBoidsOrPlayersInArea(this.position, config_1.config.boid.attractionRadius).filter((boid) => boid !== this);
        if (neighbours.length === 0) {
            return null;
        }
        const nearestNeighbour = staticTools_1.StaticTools
            .nearestCreatureToPosition(neighbours, this.position);
        return this.position
            .vectorTo(nearestNeighbour.position)
            .scaleToLength(this.fearCountdown
            ? this.maxSpeed
            : nearestNeighbour.speed * 1.1);
    }
    die() {
        this.creatureStorage.remove(this.id);
    }
}
exports.Boid = Boid;

},{"../config":3,"../vector2":15,"./behaviour":5,"./behaviourControlledCreature":6,"./staticTools":12}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector2_1 = require("../vector2");
class Creature {
    distanceToCreature(creature) {
        return this.position.distance(creature.position);
    }
    updateHistory() {
        this.history.push(this.position);
        this.history = this.history.slice(1);
    }
    velocity() {
        return vector2_1.Vector2.fromHeadingAndSpeed(this.heading, this.speed);
    }
}
exports.Creature = Creature;

},{"../vector2":15}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const behaviour_1 = require("./behaviour");
const staticTools_1 = require("./staticTools");
const behaviourControlledCreature_1 = require("./behaviourControlledCreature");
class Hunter extends behaviourControlledCreature_1.BehaviourControlledCreature {
    constructor() {
        super(...arguments);
        this.defaultColour = config_1.config.hunter.defaultColour;
        this.maxSpeed = config_1.config.hunter.maxSpeed;
        this.minSpeed = config_1.config.hunter.minSpeed;
        this.size = config_1.config.hunter.size;
        this.heading = 0;
        this.speed = 0;
        this.priorities = [
            new behaviour_1.Behaviour(() => this.huntingVector(), () => "DeepPink"),
        ];
    }
    initializeVelocity() {
        this.heading = Math.random() * 2 * Math.PI;
        this.speed = config_1.config.hunter.minSpeed;
    }
    update() {
        this.eat();
        this.move();
    }
    chanceToSee(viewerPosition, viewerSightRange) {
        const distance = viewerPosition.distance(this.position);
        const visibilityFromDistance = (viewerSightRange - distance) / viewerSightRange;
        const visibilityFromSpeed = (this.speed - config_1.config.hunter.minSpeed)
            / (config_1.config.hunter.maxSpeed - config_1.config.hunter.minSpeed);
        return visibilityFromDistance * visibilityFromSpeed;
    }
    huntingVector() {
        const preyInSight = this.creatureStorage.getBoidsInArea(this.position, config_1.config.hunter.visionRadius);
        if (preyInSight.length === 0) {
            return null;
        }
        const nearestPrey = staticTools_1.StaticTools
            .nearestCreatureToPosition(preyInSight, this.position);
        return this.position
            .vectorTo(nearestPrey.position.add(nearestPrey.velocity()))
            .scaleToLength(config_1.config.hunter.maxSpeed);
    }
    eat() {
        this.creatureStorage.getBoidsInArea(this.position, config_1.config.hunter.eatRadius).forEach((prey) => prey.die());
    }
    die() {
        this.creatureStorage.remove(this.id);
    }
}
exports.Hunter = Hunter;

},{"../config":3,"./behaviour":5,"./behaviourControlledCreature":6,"./staticTools":12}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector2_1 = require("../vector2");
const creature_1 = require("./creature");
const config_1 = require("../config");
class PlayerFish extends creature_1.Creature {
    constructor(inputHandler) {
        super();
        this.inputHandler = inputHandler;
        this.colour = "black";
        this.size = 6;
        this.heading = 0;
        this.speed = 0;
        this.history = [];
        this.position = new vector2_1.Vector2(window.innerWidth / 2, window.innerHeight / 2);
        for (let i = 0; i < config_1.config.creature.maxHistory; i++) {
            this.history.push(this.position);
        }
    }
    update() {
        this.updateHistory();
        const direction = this.inputHandler.getDirectionInput();
        this.heading += Math.max(-0.1, Math.min(0.1, direction));
        this.speed += Math.max(0, 0.5 - 0.5 * Math.abs(1 - Math.abs(direction / 10)));
        this.speed *= 0.98;
        this.position = this.position.add(this.velocity()).normalize();
    }
}
exports.default = PlayerFish;

},{"../config":3,"../vector2":15,"./creature":8}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Priority {
    constructor(idealHeading, color) {
        this.idealHeading = idealHeading;
        this.color = color;
    }
}
exports.Priority = Priority;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StaticTools {
    static nearestCreatureToPosition(creatures, position) {
        if (creatures.length === 0) {
            throw new Error("Nearest creature is undefined for zero creatures");
        }
        return creatures.reduce((previous, current) => {
            const currentDistance = position.vectorTo(current.position).length;
            if (previous.distance > currentDistance) {
                return {
                    distance: currentDistance,
                    nearest: current,
                };
            }
            return previous;
        }, {
            distance: position.vectorTo(creatures[0].position).length,
            nearest: creatures[0],
        }).nearest;
    }
}
exports.StaticTools = StaticTools;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector2_1 = require("./vector2");
const config_1 = require("./config");
class InputHandler {
    constructor(canvas, createBoid, createHunter) {
        this.left = false;
        this.right = false;
        this.leftCount = 0;
        this.rightCount = 0;
        this.canvas = canvas;
        this.createBoid = createBoid;
        this.createHunter = createHunter;
        this.separationLabel = document.getElementById("separation-status");
        this.alignmentLabel = document.getElementById("alignment-status");
        this.cohesionLabel = document.getElementById("cohesion-status");
        this.canvas.onclick((event) => {
            this.handleMouseClick(event);
        });
        window.addEventListener("keyup", (event) => {
            this.handleKeyUp(event);
        });
        window.addEventListener("keyup", (event) => {
            this.setArrow(event.key, false);
        });
        window.addEventListener("keydown", (event) => {
            this.setArrow(event.key, true);
        });
    }
    handleMouseClick(event) {
        const mousePosition = this.canvas.getPositionInWorldSpace(new vector2_1.Vector2(event.clientX, event.clientY));
        if (event.ctrlKey || event.metaKey) {
            this.createHunter(mousePosition);
        }
        else {
            this.createBoid(mousePosition);
        }
    }
    handleKeyUp(event) {
        const oneKeyCode = 49;
        const twoKeyCode = 50;
        const threeKeyCode = 51;
        switch (event.keyCode) {
            case oneKeyCode:
                this.toggleSeparation();
                break;
            case twoKeyCode:
                this.toggleAlignment();
                break;
            case threeKeyCode:
                this.toggleCohesion();
                break;
            default: return;
        }
    }
    toggleSeparation() {
        if (config_1.config.boid.repulsionRadius) {
            config_1.config.boid.repulsionRadius = 0;
            this.separationLabel.textContent = "OFF";
            this.separationLabel.style.color = "red";
        }
        else {
            config_1.config.boid.repulsionRadius = config_1.config.boid.repulsionRadiusDefault;
            this.separationLabel.textContent = "ON";
            this.separationLabel.style.color = "green";
        }
    }
    toggleAlignment() {
        if (config_1.config.boid.alignmentRadius) {
            config_1.config.boid.alignmentRadius = 0;
            this.alignmentLabel.textContent = "OFF";
            this.alignmentLabel.style.color = "red";
        }
        else {
            config_1.config.boid.alignmentRadius = config_1.config.boid.alignmentRadiusDefault;
            this.alignmentLabel.textContent = "ON";
            this.alignmentLabel.style.color = "green";
        }
    }
    toggleCohesion() {
        if (config_1.config.boid.attractionRadius) {
            config_1.config.boid.attractionRadius = 0;
            this.cohesionLabel.textContent = "OFF";
            this.cohesionLabel.style.color = "red";
        }
        else {
            config_1.config.boid.attractionRadius = config_1.config.boid.attractionRadiusDefault;
            this.cohesionLabel.textContent = "ON";
            this.cohesionLabel.style.color = "green";
        }
    }
    getDirectionInput() {
        if (this.left && !this.right) {
            this.rightCount = 0;
            this.leftCount++;
        }
        else if (this.right && !this.left) {
            this.leftCount = 0;
            this.rightCount++;
        }
        else {
            this.leftCount = 0;
            this.rightCount = 0;
        }
        return this.rightCount - this.leftCount;
    }
    setArrow(key, newState) {
        switch (key) {
            case "ArrowLeft":
                this.left = newState;
                break;
            case "ArrowRight":
                this.right = newState;
                break;
            default:
                return;
        }
    }
}
exports.InputHandler = InputHandler;

},{"./config":3,"./vector2":15}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("./canvas");
const config_1 = require("./config");
const inputHandler_1 = require("./inputHandler");
const creatureStorage_1 = require("./creatureStorage");
class SimulationManager {
    constructor() {
        const canvasElement = document.getElementById("canvas");
        if (!canvasElement) {
            throw new Error("couldn't find 'canvas' on document");
        }
        this.canvas = new canvas_1.Canvas(canvasElement);
        this.inputHandler = new inputHandler_1.InputHandler(this.canvas, (position) => this.createBoid(position), (position) => this.createHunter(position));
        this.creatureStorage = new creatureStorage_1.CreatureStorage(this.inputHandler);
        for (let i = 0; i < config_1.config.boid.quantity; i++) {
            this.creatureStorage.addBoid();
        }
        for (let i = 0; i < config_1.config.hunter.quantity; i++) {
            this.creatureStorage.addHunter();
        }
        this.playerFish = this.creatureStorage.addPlayerFish();
    }
    createBoid(position) {
        this.creatureStorage.addBoid(position);
    }
    createHunter(position) {
        this.creatureStorage.addHunter(position);
    }
    runSimulation() {
        this.tick();
    }
    tick() {
        this.creatureStorage.update();
        for (const boid of this.creatureStorage.getAllBoids()) {
            boid.update();
        }
        for (const hunter of this.creatureStorage.getAllHunters()) {
            hunter.update();
        }
        this.playerFish.update();
        this.canvas.draw(this.creatureStorage.getAllCreatures(), this.playerFish.position);
        this.updateHunterCountDisplay(this.creatureStorage.getHunterCount());
        this.updateBoidCountDisplay(this.creatureStorage.getBoidCount());
        ((thisCaptured) => {
            setTimeout(() => {
                thisCaptured.tick();
            }, 1000 / 60);
        })(this);
    }
    updateHunterCountDisplay(count) {
        const countDisplay = document.getElementById("number-of-hunters");
        if (countDisplay) {
            countDisplay.textContent = `${count}`;
        }
    }
    updateBoidCountDisplay(count) {
        const countDisplay = document.getElementById("number-of-boids");
        if (countDisplay) {
            countDisplay.textContent = `${count}`;
        }
    }
}
exports.SimulationManager = SimulationManager;

},{"./canvas":2,"./config":3,"./creatureStorage":4,"./inputHandler":13}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
class Vector2 {
    static average(vectors) {
        if (vectors.length === 0) {
            return new Vector2();
        }
        const totalVector = vectors.reduce((partialSum, current) => {
            return partialSum.add(current);
        });
        return totalVector.scaleByScalar(1 / vectors.length);
    }
    static fromHeadingAndSpeed(heading, speed) {
        if (!speed) {
            return new Vector2(0, 0);
        }
        return new Vector2(speed * Math.cos(heading), speed * Math.sin(heading));
    }
    constructor(x = 0, y = 0) {
        this.x = x % config_1.config.screen.maxX;
        this.y = y % config_1.config.screen.maxY;
        this.length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    unitVector() {
        return this.scaleByScalar(1 / this.length);
    }
    distance(v) {
        return this.vectorTo(v).length;
    }
    vectorTo(vector) {
        let nearestX = (vector.x - this.x) % config_1.config.screen.maxX;
        if (nearestX > (config_1.config.screen.maxX / 2)) {
            nearestX -= config_1.config.screen.maxX;
        }
        if (nearestX < -(config_1.config.screen.maxX / 2)) {
            nearestX += config_1.config.screen.maxX;
        }
        let nearestY = (vector.y - this.y) % config_1.config.screen.maxY;
        if (nearestY > (config_1.config.screen.maxY / 2)) {
            nearestY -= config_1.config.screen.maxY;
        }
        if (nearestY < -(config_1.config.screen.maxY / 2)) {
            nearestY += config_1.config.screen.maxY;
        }
        return new Vector2(nearestX, nearestY);
    }
    rotate(radians) {
        return new Vector2(this.x * Math.cos(radians) - this.y * Math.sin(radians), this.x * Math.sin(radians) + this.y * Math.cos(radians));
    }
    // Measures anti clockwise from -PI to PI
    angleTo(v) {
        return Math.atan2(this.x * v.y - this.y * v.x, this.x * v.x + this.y * v.y);
    }
    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    subtract(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    equals(v) {
        return this.x === v.x && this.y === v.y;
    }
    scaleByScalar(scale) {
        return new Vector2(this.x * scale, this.y * scale);
    }
    scaleToLength(length) {
        return this.length ?
            this.scaleByScalar(length / this.length) :
            this;
    }
    isParallelTo(v) {
        return this.x * v.y === this.y * v.x;
    }
    normalize() {
        if (0 <= this.x &&
            0 <= this.y) {
            return this;
        }
        return new Vector2(((this.x % config_1.config.screen.maxX) + config_1.config.screen.maxX) % config_1.config.screen.maxX, ((this.y % config_1.config.screen.maxY) + config_1.config.screen.maxY) % config_1.config.screen.maxY);
    }
    toHeading() {
        return Math.atan2(this.y, this.x);
    }
    toString() {
        return `[${this.x}, ${this.y}]`;
    }
}
exports.Vector2 = Vector2;

},{"./config":3}]},{},[1]);
