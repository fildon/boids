export class FpsCounter {
    private readonly SECOND = 1000;
    private static _fpsCounter: FpsCounter;

    private fpsLabel: HTMLElement;
    private recentDraws: number[] = [];

    public static getFpsCounter(): FpsCounter {
        return this._fpsCounter || (this._fpsCounter = new FpsCounter());
    }

    private constructor() {
        this.fpsLabel = document.getElementById("fps-status")!;
    }

    public addDraw(): void {
        this.recentDraws.push(Date.now());
    }

    public updateFps(): void {
        const currentTime = Date.now();
        this.recentDraws = this.recentDraws.filter((drawTime: number) => drawTime >= currentTime - this.SECOND);
        this.fpsLabel.textContent = this.recentDraws.length.toString();
    }
}


