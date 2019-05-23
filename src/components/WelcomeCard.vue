<template>
  <div class="container">
    <div class="card">
      <div v-if="menuState === 'default'" class="join-options">
        <input type="text" placeholder="Your Name" v-model="newUserName">
        <button @click="setUserName()">Enter</button>
      </div>
      <div v-if="menuState === 'selectJoin'" class="join-options">
        <button class="join-option" @click="setMenuState('createNew')">Create a new board</button>
        <button class="join-option" @click="setMenuState('selectExisting')">Join an existing board</button>
      </div>
      <div v-if="menuState === 'createNew'" class="join-options">
        <input type="text" placeholder="Board Name..." v-model="newBoardName">
        <button @click="startNewBoard">Submit</button>
        <button @click="setMenuState('selectJoin')">Cancel</button>
      </div>
      <div v-if="menuState === 'selectExisting'" class="join-options">
        <button
          v-for="board in boardNames"
          :key="board"
          class="join-option"
          @click="selectBoard(board)"
        >{{board}}</button>
        <button @click="setMenuState('selectJoin')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import storage from "../localstorage.js";
export default {
  data() {
    return {
      menuState: "default",
      newUserName: undefined,
      newBoardName: undefined,
      boardNames: []
    };
  },
  sockets: {},
  computed: {},
  methods: {
    setUserName() {
      storage.setUser({ name: this.newUserName });
      this.setMenuState("selectJoin");
    },
    setMenuState(state) {
      console.log(state);
      this.menuState = state;
    },
    startNewBoard() {
      this.$socket.emit("newBoard", this.newBoardName, err => {
        if (err) {
          console.log(err);
        } else {
          storage.setRoom(this.newBoardName);
          this.$emit("goToBoard", this.newBoardName);
        }
      });
    },
    selectBoard(boardName) {
      storage.setRoom(boardName);
      this.$emit("goToBoard", boardName);
    }
  },
  created() {
    this.$socket.emit("getBoardNames", boardNames => {
      this.boardNames = boardNames;
    });
  }
};
</script>


<style lang="scss" scoped>
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
