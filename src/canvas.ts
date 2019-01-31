import { config } from "./config";
import { Creature } from "./creatures/creature";
import THREE = require("three");

export class Canvas {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;

    constructor() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth/window.innerHeight
        );
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(
            window.innerWidth * 0.9,
            window.innerHeight * 0.9
        );

        document.body.appendChild(this.renderer.domElement);

        window.addEventListener('resize', () => this.setScreenSize(), false);
    }

    public setScreenSize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(
            window.innerWidth * 0.9,
            window.innerHeight * 0.9
        );
    }

    render(): void {
        this.renderer.render(this.scene, this.camera);
    }

    add(renderedBody: THREE.Mesh): void {
        this.scene.add(renderedBody);
    }

    delete(renderedBody: THREE.Mesh): void {
        this.scene.remove(renderedBody);
    }
}
