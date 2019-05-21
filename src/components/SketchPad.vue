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
      mouseY: 0
    };
  },
  methods: {
    setPosition(e) {
      const { top, left } = canvas.getBoundingClientRect();
      this.mouseX = e.changedTouches
        ? e.changedTouches[0].pageX - left
        : e.offsetX;
      this.mouseY = e.changedTouches
        ? e.changedTouches[0].pageY - top
        : e.offsetY;
    },
    startStroke(e) {
      console.log("start stroke");
      this.isDrawing = true;
    },
    continueStroke(e) {
      if (this.isDrawing) {
        console.log("continue stroke");
      }
    },
    endStroke() {
      console.log("end stroke");
      this.isDrawing = false;
    },
    drawStrokes() {
      const canvas = this.canvas;
      const context = this.context;

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

