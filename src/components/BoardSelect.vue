<template>
  <div class="container">
    <div class="card">
      <h2>Choose a Board</h2>
      <button class="join-option" @click="goToPage('new-board')">
        <div class="join-icon">
          <i class="far fa-plus-square fa-lg"></i>
        </div>
        <div class="join-text">Create a new board</div>
      </button>
      <button
        v-for="board in boardNames"
        :key="board"
        class="join-option"
        @click="selectBoard(board)"
      >
        <div class="join-icon">
          <i class="far fa-edit fa-lg clr-white"></i>
        </div>
        <div class="join-text">{{board}}</div>
      </button>
      <button class="btn bg-red clr-white" @click="logOut">Log Out</button>
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
    logOut() {
      this.goToPage("enter-name");
      storage.unsetUser();
    },
    goToPage(page) {
      this.$emit("goToPage", page);
    },
    selectBoard(boardName) {
      storage.setRoom(boardName);
      this.$emit("goToBoard", boardName);
      this.goToPage("sketch-pad");
    }
  },
  created() {
    this.$emit("refresh");
  }
};
</script>

<style>
</style>
