import { Vector2 } from "./vector2";
import { config } from "./config";

export class MouseHandler {
    public mousePosition: Vector2 | null;
    private mouseArea: HTMLElement;
    private createBoid: (position: Vector2) => void;
    private createHunter: (position: Vector2) => void;

    constructor(
        mouseArea: HTMLElement,
        createBoid: (position: Vector2) => void,
        createHunter: (position: Vector2) => void,
    ) {
        this.mousePosition = new Vector2(-1, -1);
        this.mouseArea = mouseArea;
        this.createBoid = createBoid;
        this.createHunter = createHunter;
        this.mouseArea.onmousemove = (event: MouseEvent) => {
            this.setMousePosition(event);
        };
        this.mouseArea.onmouseout = () => { this.handleMouseOut(); };
        this.mouseArea.onclick = (event: MouseEvent) => {
            this.handleMouseClick(event);
        };
        window.addEventListener("keyup", (event: KeyboardEvent) => {
            this.handleKeyUp(event);
        });
    }

    public setMousePosition(event: MouseEvent) {
        const rect = this.mouseArea.getBoundingClientRect();
        this.mousePosition = new Vector2(
            event.clientX - rect.left,
            event.clientY - rect.top,
        );
    }

    public handleMouseClick(event: MouseEvent) {
        this.setMousePosition(event);
        if (this.mousePosition) {
            if (event.ctrlKey || event.metaKey) {
                this.createHunter(this.mousePosition);
            } else {
                this.createBoid(this.mousePosition);
            }
        }
    }

    public handleMouseOut() {
        this.mousePosition = null;
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
            // tslint:disable-next-line:no-console
            console.log("Separation turned off");
            config.boid.repulsionRadius = 0;
        } else {
            // tslint:disable-next-line:no-console
            console.log("Separation turned on");
            config.boid.repulsionRadius = config.boid.repulsionRadiusDefault;
        }
    }

    public toggleAlignment() {
        if (config.boid.alignmentRadius) {
            // tslint:disable-next-line:no-console
            console.log("Alignment turned off");
            config.boid.alignmentRadius = 0;
        } else {
            // tslint:disable-next-line:no-console
            console.log("Alignment turned on");
            config.boid.alignmentRadius = config.boid.alignmentRadiusDefault;
        }
    }

    public toggleCohesion() {
        if (config.boid.attractionRadius) {
            // tslint:disable-next-line:no-console
            console.log("Cohesion turned off");
            config.boid.attractionRadius = 0;
        } else {
            // tslint:disable-next-line:no-console
            console.log("Cohesion turned on");
            config.boid.attractionRadius = config.boid.attractionRadiusDefault;
        }
    }
}
