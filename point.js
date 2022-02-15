const colors = [
  "E56D6A",
  "CE5F7F",
  "B7558C",
  "984794",
  "7E4B98",
  "704F9B",
  "64539D",
  "56589F",
  "4F6799",
  "497393",
  "41878A",
  "489C7A",
  "5BB956",
  "90CC5E",
  "AFD563",
  "C9DD66",
  "E2E46A",
  "E5D96A",
  "E5D06A",
  "E5C66A",
  "E5BC6A",
  "E5B06A",
  "E5A26A",
  "E58F6A",
];

const MOVESPEED = 0.2;
const PI = Math.PI;
const PI2 = Math.PI * 2;

export class Point {
  constructor(radius = 0, angle = 0) {
    this.radius = radius;
    this.angle = angle;
    this.x = this.radius * Math.cos(this.angle);
    this.y = -this.radius * Math.sin(this.angle);
    this.force = 0;
    this.rotateSpeed = 0;
    this.resistance = 0;
    this.color;
    this.linkText = "";
    // this.addEventListener ('click', this.link.bind(this), false);
  }

  resize(stageWidth, stageHeight) {
    this.radius = Math.min(stageWidth, stageHeight) * 0.8;
    // 0.4 = Radius ratio
  }
  //오른쪽으로 돌리면 angle diff +, 왼쪽으로 돌리면 angle diff -
  rotate(angle) {
    this.angle = this.angle + angle;
    if (this.angle > PI2) {
      this.angle -= PI2;
    } else if (this.angle < 0) {
      this.angle += PI2;
    }
    this.x = this.radius * Math.cos(this.angle);
    this.y = -this.radius * Math.sin(this.angle);
  }

  calAcceleration(force) {
    let rotateSpeed = force * 0.1 * (Math.PI / 180);
    return rotateSpeed;
  }
  //maintain this angle from 0 to 2PI
  keepangle() {
    if (this.angle > PI2) {
      while (this.angle > PI2) {
        this.angle -= PI2;
      }
    } else if (this.angle < 0) {
      while (this.angle < 0) {
        this.angle += PI2;
      }
    }
  }

  animate(ctx, stageWidth, stageHeight, total_i, i, diffX) {
    const angle = PI2 / 4;
    const horizonLength = 150;
    const verticalLength = 160 * 1.618;

    ctx.save();
    ctx.translate(stageWidth / 2, stageHeight + 240);

    let rotateSpeed = this.calAcceleration(diffX);

    this.rotate(rotateSpeed);
    ctx.translate(this.x, this.y);
    if (0 < this.angle && this.angle < PI / 2) {
      ctx.rotate(PI / 2 - this.angle + PI / 4);
    } else if (this.angle == PI / 2) {
      ctx.rotate(PI / 4);
    } else if (PI / 2 < this.angle && this.angle < PI) {
      ctx.rotate((PI / 2) * 3 - this.angle + PI / 4);
    } else if (this.angle == PI) {
      ctx.rotate(PI / 4);
    } else if (PI < this.angle && this.angle < (PI / 2) * 3) {
      ctx.rotate((PI / 2) * 3 - this.angle + PI / 4);
    } else if (this.angle == (PI / 2) * 3) {
      ctx.rotate(PI / 4);
    } else if ((PI / 2) * 3 < this.angle && this.angle < PI2) {
      ctx.rotate(PI / 2 - this.angle + PI / 4);
    } else if (this.angle == 0) {
      ctx.rotate(PI / 4);
    }
    this.color = `#${colors[2 * i]}`;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    let x;
    let y;
    let prevX;
    let prevY;
    for (let j = 0; j < 4; j++) {
      x = horizonLength * Math.cos(angle * j);
      y = horizonLength * Math.sin(angle * j);
      prevX = 155 * Math.cos(angle * j - PI / 4);
      prevY = 155 * Math.sin(angle * j - PI / 4);
      j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
  link(mouseX, mouseY, ctx) {
    const click_pixel = ctx.getImageData(mouseX, mouseY, 1, 1).data;
    const now_color = this.hexToRgb(this.color);
    let cnt = 0;
    for (let i = 0; i < 4; i++) {
      if (click_pixel[i] == now_color[i]) {
        cnt++;
      }
    }
    if (cnt == 4) {
      window.location = this.linkText;
    }
  }

  hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
          255,
        ]
      : null;
  }
}
