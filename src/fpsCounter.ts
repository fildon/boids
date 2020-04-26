export class FpsCounter {
  public static getFpsCounter(): FpsCounter {
    return this.fpsCounter || (this.fpsCounter = new FpsCounter());
  }

  private static fpsCounter: FpsCounter;
  private readonly SECOND = 1000;

  private fpsLabel: HTMLElement;
  private recentFrames: number[] = [];
  private start: number;

  private constructor() {
    this.fpsLabel = document.getElementById("fps-status")!;
    this.start = performance.now();
  }

  public countFrame(): void {
    this.recentFrames.push(performance.now());
  }

  public getFPS(): number {
    const currentTime = performance.now();
    const multiplier = currentTime - this.start < this.SECOND ?
      Math.floor(1000 / (currentTime - this.start)) :
      1;
    return this.recentFrames.filter(
      (drawTime: number) => drawTime >= currentTime - this.SECOND,
    ).length * multiplier;
  }

  public updateFps(): void {
    this.fpsLabel.textContent = this.getFPS().toString();
  }
}
