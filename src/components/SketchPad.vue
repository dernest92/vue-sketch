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
        <button class="btn-round" @click="goToPage('board-select')">
          <i class="fas fa-door-open fa-lg"></i>
        </button>
        <button class="btn-round" @click="back(true)" :disabled="!canUndo">
          <i class="fas fa-undo fa-lg"></i>
        </button>
        <button class="btn-round" @click="clear" :disabled="!canUndo">
          <i class="fas fa-recycle fa-lg"></i>
        </button>
        <button class="btn-round" @click="redo" :disabled="!canRedo">
          <i class="fas fa-redo fa-lg"></i>
        </button>
      </div>
      <div class="toolbar">
        <div class="brush-controls">
          <div class="color-control">
            <button
              class="btn-round color-option"
              v-for="color in colorOptions"
              @click="setColor(color)"
              :key="color"
              :style="{background: color}"
            ></button>
          </div>
          <div class="size-control">
            <input v-model="size" type="range" min="1" max="40">
          </div>
        </div>
        <div class="brush-sample-contianer">
          <div
            class="brush-sample"
            :style="{background: color, height: (size + 'px'), width: (size + 'px')}"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import storage from "../localstorage.js";
import { setTimeout } from "timers";

export default {
  props: {
    board: String
  },
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
      deletedStrokes: [],
      colorOptions: [
        "#ff0000",
        "#ffa500",
        "#ffff00",
        "#008000",
        "#0000ff",
        "#4b0082",
        "#333333",
        "#ffffff"
      ]
    };
  },
  sockets: {
    msgToClients(msg) {
      console.log(msg);
    },
    recieveStroke(stroke) {
      this.strokes.push(stroke);
      this.drawStrokes();
    },
    recieveStrokes(strokes) {
      this.strokes = [...strokes];
      this.drawStrokes();
    },
    recieveClearStrokes() {
      this.strokes = [];
      this.deletedStrokes = [];
      this.drawStrokes();
    },
    recieveRemoveStroke() {
      this.back(false);
    }
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
    goToPage(page) {
      this.$emit("goToPage", page);
      storage.unsetRoom();
    },
    setColor(color) {
      this.color = color;
    },
    redo() {
      const revived = this.deletedStrokes.pop();
      this.strokes.push(revived);
      this.$socket.emit("sendStroke", {
        boardName: this.board,
        stroke: revived
      });
      this.drawStrokes();
    },
    back(sendSocket) {
      const removed = this.strokes.pop();
      this.deletedStrokes.push(removed);
      if (sendSocket) this.$socket.emit("sendRemoveStroke", this.board);
      this.drawStrokes();
    },
    clear() {
      this.strokes = [];
      this.deletedStrokes = [];
      this.$socket.emit("sendClearStrokes", this.board);
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
      if (this.isDrawing) {
        this.$socket.emit("sendStroke", {
          boardName: this.board,
          stroke: this.strokes[this.strokes.length - 1]
        });
      }
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
      console.log(this.board);
      this.$socket.emit("joinBoard", this.board, (err, strokes) => {
        if (err) {
          this.goToPage("board-select");
          return console.log(err);
        }
        this.strokes = strokes;
        this.drawStrokes();
      });
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
  grid-template-columns: auto 60px;
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
  background: #f4f4f4;
  padding: 5px;
  border-radius: 8px;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.2);
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 5px;
}

.brush-sample-contianer {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ccc;
  height: 100%;
  width: 100%;
  border-radius: 5px;
  box-shadow: inset 1px 1px 4px rgba(0, 0, 0, 0.2);

  .brush-sample {
    border-radius: 50%;
  }
}

.color-control {
  display: flex;
  justify-content: space-evenly;
}

.size-control {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  input {
    width: 100%;
  }
}
</style>
