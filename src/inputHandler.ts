import { Vector2 } from "./vector2";
import { config } from "./config";
import { Canvas } from "./canvas";

export class InputHandler {
    private canvas: Canvas;
    private createBoid: (position: Vector2) => void;
    private createHunter: (position: Vector2) => void;
    private separationLabel: HTMLElement;
    private alignmentLabel: HTMLElement;
    private cohesionLabel: HTMLElement;

    private left = false;
    private right = false;
    private leftCount = 0;
    private rightCount = 0;

    constructor(
        canvas: Canvas,
        createBoid: (position: Vector2) => void,
        createHunter: (position: Vector2) => void,
    ) {
        this.canvas = canvas;
        this.createBoid = createBoid;
        this.createHunter = createHunter;
        this.separationLabel = document.getElementById("separation-status")!;
        this.alignmentLabel = document.getElementById("alignment-status")!;
        this.cohesionLabel = document.getElementById("cohesion-status")!;
        this.canvas.onclick((event: MouseEvent) => {
            this.handleMouseClick(event);
        });
        window.addEventListener("keyup", (event: KeyboardEvent) => {
            this.handleKeyUp(event);
        });
        window.addEventListener("keyup", (event) => {
            this.setArrow(event.key, false);
        });
        window.addEventListener("keydown", (event) => {
            this.setArrow(event.key, true);
        });
    }

    public handleMouseClick(event: MouseEvent) {
        const mousePosition = this.canvas.getPositionInWorldSpace(
            new Vector2(
                event.clientX,
                event.clientY,
            ),
        );
        if (event.ctrlKey || event.metaKey) {
            this.createHunter(mousePosition);
        } else {
            this.createBoid(mousePosition);
        }
    }

    public handleKeyUp(event: KeyboardEvent) {
        const oneKeyCode = 49;
        const twoKeyCode = 50;
        const threeKeyCode = 51;
        switch (event.keyCode) {
            case oneKeyCode: this.toggleSeparation(); break;
            case twoKeyCode: this.toggleAlignment(); break;
            case threeKeyCode: this.toggleCohesion(); break;
            default: return;
        }
    }

    public toggleSeparation() {
        if (config.boid.repulsionRadius) {
            config.boid.repulsionRadius = 0;
            this.separationLabel.textContent = "OFF";
            this.separationLabel.style.color = "red";
        } else {
            config.boid.repulsionRadius = config.boid.repulsionRadiusDefault;
            this.separationLabel.textContent = "ON";
            this.separationLabel.style.color = "green";
        }
    }

    public toggleAlignment() {
        if (config.boid.alignmentRadius) {
            config.boid.alignmentRadius = 0;
            this.alignmentLabel.textContent = "OFF";
            this.alignmentLabel.style.color = "red";
        } else {
            config.boid.alignmentRadius = config.boid.alignmentRadiusDefault;
            this.alignmentLabel.textContent = "ON";
            this.alignmentLabel.style.color = "green";
        }
    }

    public toggleCohesion() {
        if (config.boid.attractionRadius) {
            config.boid.attractionRadius = 0;
            this.cohesionLabel.textContent = "OFF";
            this.cohesionLabel.style.color = "red";
        } else {
            config.boid.attractionRadius = config.boid.attractionRadiusDefault;
            this.cohesionLabel.textContent = "ON";
            this.cohesionLabel.style.color = "green";
        }
    }

    public getDirectionInput() {
        if (this.left && !this.right) {
            this.rightCount = 0;
            this.leftCount++;
        } else if (this.right && !this.left) {
            this.leftCount = 0;
            this.rightCount++;
        } else {
            this.leftCount = 0;
            this.rightCount = 0;
        }
        return this.rightCount - this.leftCount;
    }

    private setArrow(key: string, newState: boolean) {
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
