<template>
  <div class="container">
    <div class="card">
      <div class="join-options">
        <button class="join-option" @click="goToPage('new-board')">Create a new board</button>
        <button
          v-for="board in boardNames"
          :key="board"
          class="join-option"
          @click="selectBoard(board)"
        >{{board}}</button>
        <button @click="goToPage('enter-name')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import storage from "../localstorage.js";

export default {
  props: {
    boardNames: Array
  },
  data() {
    return {};
  },
  methods: {
    goToPage(page) {
      this.$emit("goToPage", page);
    },
    selectBoard(boardName) {
      storage.setRoom(boardName);
      this.$emit("goToBoard", boardName);
      this.goToPage("sketch-pad");
    }
  }
};
</script>

<style>
</style>
