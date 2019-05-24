<template>
  <div id="app">
    <SketchPad
      v-if="showPage === 'sketch-pad'"
      id="sketch-pad"
      class="content-area"
      @goToPage="goToPage"
      @refresh="setBoardNames"
      :board="board"
    />
    <WelcomeCard v-if="showPage === 'enter-name'" class="content-area" @goToPage="goToPage"/>
    <NewBoard
      v-if="showPage === 'new-board'"
      @goToPage="goToPage"
      class="content-area"
      @goToBoard="goToBoard"
    />
    <BoardSelect
      v-if="showPage === 'board-select'"
      class="content-area"
      :boardNames="boardNames"
      @goToPage="goToPage"
      @goToBoard="goToBoard"
    />
  </div>
</template>

<script>
import SketchPad from "./components/SketchPad.vue";
import WelcomeCard from "./components/WelcomeCard.vue";

import NewBoard from "./components/NewBoard.vue";
import BoardSelect from "./components/BoardSelect.vue";
import storage from "./localstorage.js";
export default {
  name: "app",
  components: {
    SketchPad,
    WelcomeCard,
    NewBoard,
    BoardSelect
  },
  sockets: {
    newBoardCreated(boardName) {
      this.boardNames.push(boardName);
    }
  },
  data() {
    return {
      isLoggedIn: false,
      board: undefined,
      showPage: "enter-name",
      boardNames: []
    };
  },
  methods: {
    goToBoard(board) {
      this.isLoggedIn = true;
      this.board = board;
    },
    goToPage(page) {
      this.showPage = page;
    },
    setBoardNames() {
      this.$socket.emit("getBoardNames", boardNames => {
        console.log("set board names");
        this.boardNames = boardNames;
      });
    }
  },
  created() {
    const user = storage.getUser();
    if (!user) {
      this.showPage = "enter-name";
    } else {
      if (!user.room) {
        this.showPage = "board-select";
      } else {
        this.board = user.room;
        this.showPage = "sketch-pad";
      }
    }
    this.setBoardNames();
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.content-area {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  background: #ff9770;
}

input {
  font-size: 16px;
  padding: 4px 6px;
  border-radius: 2px;
  border: 1px rgba(0, 0, 0, 0.3) solid;
  width: 100%;
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
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  width: 80vw;
  max-width: 400px;
  padding: 15px;

  &-sketch {
    width: fit-content;
    max-width: 100%;
    padding: 5px;
  }
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 5px;
}

.btn-round {
  border: none;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  height: 35px;
  width: 35px;
  border-radius: 50%;
  color: #333;
  transition: all 0.35s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

  &:disabled {
    opacity: 0.5;
    cursor: auto;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0);
  }

  &.color-option {
    height: 25px;
    width: 25px;
    border-radius: 8px;
    margin: 2px;
  }
}

.color-control {
  display: flex;
  justify-content: space-evenly;
}

.join-option {
  display: flex;
  width: 100%;
  background: #ccc;
  margin: 15px 0;
  border: none;
  border-radius: 5px;
  overflow: hidden;

  .join-icon {
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #32ff7e;
    background: #555;
  }

  .join-text {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 35px;
    padding: 10px;
    font-weight: bold;
    font-size: 14px;
  }
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 5px;
  margin-top: 10px;
  font-weight: bold;
  font-size: 15px;
  padding: 10px 5px;
  border: none;
  cursor: pointer;
}

.bg-green {
  background: #2ecc71;
}

.bg-red {
  background: #e74c3c;
}

.clr-white {
  color: #fff;
}

.clr-orange {
  color: #ff9770;
}

h2 {
  margin-bottom: 10px;
}
p {
  margin-bottom: 8px;
}
</style>
