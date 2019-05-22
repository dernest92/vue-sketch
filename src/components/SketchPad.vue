<template>
  <div @mouseup="endStroke" @touchend="endStroke">
    <h1>draw</h1>
    <canvas
      id="sketch-area"
      ref="my-canvas"
      @mousedown="startStroke($event)"
      @touchstart="startStroke($event)"
      @mousemove="continueStroke($event)"
      @touchmove="continueStroke($event)"
    ></canvas>
    <div class="buttons">
      <button @click="back">Back</button>
      <button @click="clear">Clear</button>
      <button @click="drawStrokes">Redraw</button>
    </div>
    <div class="size-control">
      <input v-model="size" type="range" min="1" max="20">
      <div
        class="brush-sample"
        :style="{background: color, height: (size + 'px'), width: (size + 'px'), 'border-radius': '50%'}"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDrawing: false,
      strokes: [],
      canvas: undefined,
      context: undefined,
      mouseX: 0,
      mouseY: 0,
      color: "#00bbcc",
      size: 5
    };
  },
  methods: {
    back() {
      this.strokes.pop();
      this.drawStrokes();
      console.log(this.strokes);
    },
    clear() {
      this.strokes = [];
      this.drawStrokes();
    },
    setPosition(e) {
      const { top, left } = this.canvas.getBoundingClientRect();
      this.mouseX = e.changedTouches
        ? e.changedTouches[0].pageX - left
        : e.offsetX;
      this.mouseY = e.changedTouches
        ? e.changedTouches[0].pageY - top
        : e.offsetY;
    },
    startStroke(e) {
      this.setPosition(e);
      this.isDrawing = true;
      const stroke = {
        x: [this.mouseX],
        y: [this.mouseY],
        stokeColor: this.color,
        strokeSize: this.size
      };
      this.strokes.push(stroke);
      this.drawStrokes();
    },
    continueStroke(e) {
      if (this.isDrawing) {
        this.setPosition(e);
        this.strokes[this.strokes.length - 1].x.push(this.mouseX);
        this.strokes[this.strokes.length - 1].y.push(this.mouseY);
        this.drawStrokes();
      }
    },
    endStroke() {
      this.isDrawing = false;
    },
    drawStrokes() {
      const canvas = this.canvas;
      const context = this.context;
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      this.strokes.forEach(stroke => {
        context.strokeStyle = stroke.strokeColor;
        context.lineJoin = "round";
        context.lineWidth = stroke.strokeSize;

        for (var i = 0; i < stroke.x.length; i++) {
          context.beginPath();
          if (stroke.x[i - 1] && i) {
            context.moveTo(stroke.x[i - 1], stroke.y[i - 1]);
          } else {
            context.moveTo(stroke.x[i] - 1, stroke.y[i]);
          }
          context.lineTo(stroke.x[i], stroke.y[i]);
          context.closePath();
          context.stroke();
        }
      });
    }
  },
  created() {
    this.$nextTick(() => {
      this.canvas = this.$refs["my-canvas"];
      this.context = this.canvas.getContext("2d");
      this.drawStrokes();
    });
  }
};
</script>

<style scoped>
#sketch-area {
  border: 1px #333 solid;
}
</style>

