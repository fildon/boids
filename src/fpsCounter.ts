export class FpsCounter {
    private readonly SECOND = 1000;
    private static _fpsCounter: FpsCounter;

    private fpsLabel: HTMLElement;
    private recentFrames: number[] = [];

    public static getFpsCounter(): FpsCounter {
        return this._fpsCounter || (this._fpsCounter = new FpsCounter());
    }

    private constructor() {
        this.fpsLabel = document.getElementById("fps-status")!;
    }

    public countFrame(): void {
        this.recentFrames.push(performance.now());
    }

    public updateFps(): void {
        const currentTime = performance.now()
        this.recentFrames = this.recentFrames.filter((drawTime: number) => drawTime >= currentTime - this.SECOND);
        this.fpsLabel.textContent = this.recentFrames.length.toString();
    }
}


