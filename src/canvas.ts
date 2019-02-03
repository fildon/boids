import THREE = require("three");
import { config } from "./config";
import { Line } from "three";

export class Canvas {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private worldBox: THREE.Mesh;

    constructor() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
        );
        this.camera.position.z = 520;

        this.worldBox = new THREE.Mesh(
            new THREE.BoxBufferGeometry(
                window.innerWidth * 0.9,
                window.innerHeight * 0.9,
                0.1
            ),
            new THREE.MeshBasicMaterial({color: 0xaaaadd})
        );

        this.scene.add(this.worldBox);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(
            window.innerWidth * 0.9,
            window.innerHeight * 0.9
        );

        document.body.appendChild(this.renderer.domElement);

        this.setScreenSize();
        window.addEventListener('resize', () => this.setScreenSize(), false);
    }

    public setScreenSize(): void {
        this.worldBox.position.x = innerWidth * 0.45;
        this.worldBox.position.y = innerHeight * 0.45;
        this.worldBox.geometry = new THREE.BoxBufferGeometry(
            window.innerWidth * 0.9,
            window.innerHeight * 0.9,
            0.1
        ),
        this.camera.aspect = window.innerWidth / window.innerHeight;
        config.screen.maxX = window.innerWidth * 0.9;
        config.screen.maxY = window.innerHeight * 0.9;
        this.camera.position.x = window.innerWidth * 0.45;
        this.camera.position.y = window.innerHeight * 0.45;
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
