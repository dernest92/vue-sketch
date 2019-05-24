<template>
  <div class="container" @mouseup="endStroke" @touchend="endStroke">
    <div class="card card-sketch">
      <div v-show="showPallet" class="shadow-overlay" @click="setPallet(false)"></div>
      <div class="title-bar">
        <div class="user-count centered-flex">
          <i class="fas fa-user fa-lg"></i>
          <div class="count centered-flex">35</div>
        </div>
        <h2>{{board}}</h2>
      </div>
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

      <div class="toolbar">
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
        <div @click="setPallet(true)" class="brush-sample-contianer">
          <div
            class="brush-sample"
            :style="{background: fullColor, height: (size + 'px'), width: (size + 'px')}"
          ></div>
        </div>
      </div>
      <div class="brush-editor" v-show="showPallet">
        <div class="color-swatch">
          <button
            class="btn-round color-option"
            v-for="color in colorPicker"
            @click="setColor(color)"
            :key="color"
            :style="{background: color}"
          ></button>
        </div>
        <div class="range-inputs">
          <!-- <input v-model="opacity" type="range" min="1" max="255"> -->
          <input v-model="size" type="range" min="1" max="50">
        </div>
        <div class="brush-prev" @click="setPallet(false)">
          <div
            class="brush-sample"
            :style="{background: fullColor, height: (size + 'px'), width: (size + 'px')}"
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
    board: String,
    user: String
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
      opacity: 255,
      size: 10,
      showPallet: false,
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
      ],
      colorPicker: [
        "#FFCDD2",
        "#E1BEE7",
        "#C5CAE9",
        "#B3E5FC",
        "#B2DFDB",
        "#DCEDC8",
        "#FFF9C4",
        "#FFE0B2",
        "#D7CCC8",
        "#FFFFFF",
        "#E57373",
        "#BA68C8",
        "#7986CB",
        "#4FC3F7",
        "#4DB6AC",
        "#AED581",
        "#FFF176",
        "#FFB74D",
        "#A1887F",
        "#DDDDDD",
        "#F44336",
        "#9C27B0",
        "#3f51b5",
        "#03a9f4",
        "#009688",
        "#8bc34a",
        "#ffeb3b",
        "#ff9800",
        "#795548",
        "#AAAAAA",
        "#D32f2f",
        "#7b1fa2",
        "#303f9f",
        "#0288d1",
        "#00796b",
        "#689f38",
        "#fbc02d",
        "#f57c00",
        "#5d4037",
        "#555555",
        "#b71c1c",
        "#4a148c",
        "#1a237e",
        "#01579b",
        "#004d40",
        "#33691e",
        "#f57f17",
        "#e65100",
        "#3e2723",
        "#111111"
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
    },
    fullColor() {
      return this.color + Number(this.opacity).toString(16);
    }
  },
  methods: {
    setPallet(palletState) {
      this.showPallet = palletState;
    },
    goToPage(page) {
      this.$emit("refresh");
      this.$emit("goToPage", page);
      storage.unsetRoom();
    },
    setColor(color) {
      this.color = color;
    },
    redo() {
      const revived = this.deletedStrokes.pop();
      this.strokes.push(revived);
      this.emitStroke(revived);
      this.drawStrokes();
    },
    back(sendSocket) {
      const removed = this.strokes.pop();
      this.deletedStrokes.push(removed);
      if (sendSocket)
        this.$socket.emit("sendRemoveStroke", this.board, err => {
          if (err) {
            this.goToPage("board-select");
            return console.log(err);
          }
        });
      this.drawStrokes();
    },
    clear() {
      this.strokes = [];
      this.deletedStrokes = [];
      this.$socket.emit("sendClearStrokes", this.board, err => {
        if (err) {
          this.goToPage("board-select");
          return console.log(err);
        }
      });
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
        strokeColor: this.fullColor,
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
        this.emitStroke(this.strokes[this.strokes.length - 1]);
      }
      this.isDrawing = false;
    },
    emitStroke(stroke) {
      this.$socket.emit(
        "sendStroke",
        {
          boardName: this.board,
          stroke
        },
        err => {
          if (err) {
            this.goToPage("board-select");
            return console.log(err);
          }
        }
      );
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
      this.$socket.emit(
        "joinBoard",
        { boardName: this.board, user: this.user },
        (err, strokes) => {
          if (err) {
            this.goToPage("board-select");
            return console.log(err);
          }
          this.strokes = strokes;
          this.drawStrokes();
        }
      );
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

.buttons {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-evenly;
  padding: 5px;
}

.brush-sample-contianer {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ddd;
  height: 50px;
  width: 100%;
  border-radius: 5px;
}

.brush-sample {
  border-radius: 50%;
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

.brush-editor {
  padding: 5px;
  position: absolute;
  bottom: 0px;
  right: 0px;
  left: 0px;
  height: 250px;
  z-index: 50;
  background: #fff;
  display: grid;
  grid-template-columns: auto 60px;
  grid-template-rows: auto 50px;
  border-radius: 10px;
}

.color-swatch {
  grid-column-end: span 2;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  width: 100%;
}

.range-inputs {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding: 10px;
}

.dev-box {
  border: 1px black solid;
}

.brush-prev {
  // background-image: linear-gradient(
  //     rgba(255, 255, 255, 0.8),
  //     rgba(255, 255, 255, 0.8)
  //   ),
  //   url("../assets/checkered.png");

  // background-size: cover, cover;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
}

.shadow-overlay {
  position: absolute;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  left: 0;
  top: 0;
  border-radius: 5px;
  z-index: 10;
}
.title-bar {
  position: relative;
  display: flex;
  align-items: center;

  .user-count {
    z-index: 2;
    position: absolute;
    background: #ccc;
    border-radius: 8px;
    justify-content: space-evenly;
    padding: 5px;

    i {
      margin: 5px;
      margin-right: 10px;
    }
    .count {
      width: 35px;
      height: 25px;
      border-radius: 5px;
      font-weight: bold;
      background: #f4f4f4;
    }
  }

  h2 {
    margin: 10px;
    width: 100%;
  }
}
</style>
