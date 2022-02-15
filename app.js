// import { Dialog } from "./dialog.js";
import { Point } from "./point.js";

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
    window.addEventListener("resize", this.resize.bind(this), false);
    this.resize();

    this.num = 10;
    this.degree = (Math.PI * 2) / this.num;
    this.points = [];

    for (let i = 0; i < this.num; i++) {
      const radius = Math.min(this.stageWidth, this.stageHeight) * 0.7;
      // 0.4 : Radius Ratio.
      let point = new Point(radius, this.degree * i);
      this.points.push(point);
    }

    window.requestAnimationFrame(this.animate.bind(this));

    this.beforeX = 0;
    this.down = false;
    this.diffX = 0;
    window.addEventListener("pointerdown", this.pointerdown.bind(this), false);
    window.addEventListener("pointermove", this.pointermove.bind(this), false);
    window.addEventListener("pointerup", this.pointerup.bind(this), false);
    window.addEventListener("click", this.link.bind(this), false);
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;

    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    if (this.points) {
      for (let i = 0; i < this.num; i++) {
        this.points[i].resize(this.stageWidth, this.stageHeight);
      }
    }
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    for (let i = 0; i < this.num; i++) {
      this.points[i].animate(
        this.ctx,
        this.stageWidth,
        this.stageHeight,
        this.num,
        i,
        this.diffX
      );
    }
  }

  pointerdown(e) {
    this.beforeX = e.clientX;
    this.down = true;
  }

  pointermove(e) {
    if (this.down) {
      this.diffX = -(e.clientX - this.beforeX);
      this.beforeX = e.clientX;
    }
  }

  pointerup(e) {
    this.down = false;
    this.diffX = 0;
  }

  link(e) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    for (let i = 0; i < this.num; i++) {
      this.points[i].link(mouseX, mouseY, this.ctx);
    }
  }
}

window.onload = () => {
  new App();
};
