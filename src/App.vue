<template>
  <div id="app">
    <SketchPad
      v-if="showPage === 'sketch-pad'"
      id="sketch-pad"
      class="content-area"
      @goToPage="goToPage"
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
    }
  },
  created() {
    const user = storage.getUser();
    if (!user) {
      this.isLoggedIn = false;
    }

    this.$socket.emit("getBoardNames", boardNames => {
      this.boardNames = boardNames;
    });
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

.btn {
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
  display: block;
  max-width: 300px;
  width: 70vw;
  background: #fff;
  margin: 15px;
  padding: 20px 10px;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
}
</style>
