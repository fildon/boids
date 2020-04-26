export class FpsCounter {
  public static getFpsCounter(): FpsCounter {
    return this.fpsCounter || (this.fpsCounter = new FpsCounter());
  }

  private static fpsCounter: FpsCounter;
  private readonly SECOND = 1000;

  private fpsLabel: HTMLElement;
  private recentFrames: number[] = [];

  private constructor() {
    this.fpsLabel = document.getElementById("fps-status")!;
  }

  public countFrame(): void {
    this.recentFrames.push(performance.now());
  }

  public updateFps(): void {
    const currentTime = performance.now();
    this.recentFrames = this.recentFrames.filter(
      (drawTime: number) => drawTime >= currentTime - this.SECOND,
    );
    this.fpsLabel.textContent = this.recentFrames.length.toString();
  }
}
