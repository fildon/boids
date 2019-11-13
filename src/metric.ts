export class Metric {
    private readonly SECOND = 1000;
    private static _metric: Metric;

    private fpsLabel: HTMLElement;
    private recentDraws: number[] = [];

    public static getMetric(): Metric {
        return this._metric || (this._metric = new Metric());
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


