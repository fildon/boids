const SECOND = 1000;

export class FpsCounter {
  public static getFpsCounter(): FpsCounter {
    return this.fpsCounter || (this.fpsCounter = new FpsCounter());
  }

  private static fpsCounter: FpsCounter;

  private fpsLabel: HTMLElement;
  private recentFrames: number[];

  private constructor() {
    this.fpsLabel = document.getElementById('fps-status')!;
    this.recentFrames = [];
  }

  public countFrame(): void {
    this.recentFrames.push(performance.now());
  }

  public getFPS(): number {
    const currentTime = performance.now();
    return this.recentFrames.filter(
      (drawTime: number) => drawTime >= currentTime - SECOND,
    ).length;
  }

  public updateFps(): void {
    this.fpsLabel.textContent = this.getFPS().toString();
  }
}
