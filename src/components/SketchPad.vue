<template>
  <div class="container" @mouseup="endStroke" @touchend="endStroke">
    <div class="card">
      <canvas
        id="sketch-area"
        ref="my-canvas"
        height="400"
        width="350"
        @mousedown="startStroke($event)"
        @touchstart="startStroke($event)"
        @mousemove="continueStroke($event)"
        @touchmove="continueStroke($event)"
      ></canvas>
      <div class="buttons">
        <button class="btn" @click="back" :disabled="!canUndo">
          <i class="fas fa-undo fa-lg"></i>
        </button>
        <button class="btn" @click="clear">
          <i class="fas fa-recycle fa-lg"></i>
        </button>
        <button class="btn" @click="redo" :disabled="!canRedo">
          <i class="fas fa-redo fa-lg"></i>
        </button>
      </div>
      <div class="toolbar">
        <div class="brush-controls">
          <div class="color-control">
            <input type="color" v-model="color">
          </div>
          <div class="size-control">
            <input v-model="size" type="range" min="1" max="40">
          </div>
        </div>
        <div class="brush-sample-contianer">
          <div
            class="brush-sample"
            :style="{background: color, height: (size + 'px'), width: (size + 'px'), 'border-radius': '50%'}"
          ></div>
        </div>
      </div>
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
      color: "#333333",
      size: 10,
      deletedStrokes: []
    };
  },
  computed: {
    canUndo() {
      return this.strokes.length > 0;
    },
    canRedo() {
      return this.deletedStrokes.length > 0;
    }
  },
  methods: {
    redo() {
      const revived = this.deletedStrokes.pop();
      this.strokes.push(revived);
      this.drawStrokes();
    },
    back() {
      const removed = this.strokes.pop();
      this.deletedStrokes.push(removed);
      this.drawStrokes();
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
      this.deletedStrokes = [];
      this.setPosition(e);
      this.isDrawing = true;
      const stroke = {
        x: [this.mouseX],
        y: [this.mouseY],
        strokeColor: this.color,
        strokeSize: this.size
      };
      this.strokes.push(stroke);
      this.drawStrokes();
    },
    continueStroke(e) {
      if (this.isDrawing) {
        e.preventDefault();
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


<style lang="scss" scoped>
#sketch-area {
  background: #fff;
  border: 1px #ccc dotted;
  border-radius: 5px;
  cursor: crosshair;
}

.brush-controls {
  width: 100%;
}

.toolbar {
  display: grid;
  grid-template-columns: auto 75px;
  justify-items: center;
  align-items: center;
}

.container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  // background: #444857;
  // background: #1e1f26;
  background: #f4f4f4;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.2);
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 10px;
}

.brush-sample-contianer {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ccc;
  height: 100%;
  width: 100%;
  border-radius: 5px;
}

.btn {
  border: none;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  padding: 5px;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  color: #333;
  transition: all 0.35s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

  &:disabled {
    opacity: 0.5;
    cursor: auto;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0);
  }
}
</style>
