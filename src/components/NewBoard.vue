<template>
  <div class="container">
    <div class="card">
      <div class="join-options">
        <h2>New Board</h2>
        <form @submit.prevent="startNewBoard">
          <input type="text" placeholder="Board Name..." v-model="newBoardName">
          <button type="submit" class="btn bg-green clr-white">Submit</button>
        </form>
        <button class="btn bg-red clr-white" @click="goToPage('board-select')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import storage from "../localstorage.js";

export default {
  data() {
    return {
      newBoardName: undefined
    };
  },
  methods: {
    goToPage(page) {
      this.$emit("goToPage", page);
    },

    startNewBoard() {
      this.$socket.emit("newBoard", this.newBoardName, err => {
        if (err) {
          console.log(err);
        } else {
          storage.setRoom(this.newBoardName);
          this.$emit("goToBoard", this.newBoardName);
          this.goToPage("sketch-pad");
        }
      });
    }
  }
};
</script>

