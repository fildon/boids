import { Vector2 } from "./vector2";

export class MouseHandler {
    public mousePosition: Vector2;
    private mouseArea: HTMLElement;

    constructor(mouseArea: HTMLElement) {
        this.mousePosition = new Vector2(-1, -1);
        this.mouseArea = mouseArea;
        this.mouseArea.onmousemove = (event: MouseEvent) => {
            this.handleMouseMove(event);
        };
        this.mouseArea.onmouseout = () => { this.handleMouseOut(); };
    }

    public handleMouseMove(event: MouseEvent) {
        const rect = this.mouseArea.getBoundingClientRect();
        this.mousePosition = new Vector2(
            event.clientX - rect.left,
            event.clientY - rect.top,
        );
    }

    public handleMouseOut() {
        this.mousePosition = new Vector2(-1, -1);
    }
}
