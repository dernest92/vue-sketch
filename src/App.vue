<template>
  <div id="app">
    <SketchPad v-if="isLoggedIn" id="sketch-pad" class="content-area" :board="board"/>
    <WelcomeCard v-else class="content-area" @goToBoard="goToBoard"/>
  </div>
</template>

<script>
import SketchPad from "./components/SketchPad.vue";
import WelcomeCard from "./components/WelcomeCard.vue";
import storage from "./localstorage.js";
export default {
  name: "app",
  components: {
    SketchPad,
    WelcomeCard
  },
  data() {
    return {
      isLoggedIn: false,
      board: undefined
    };
  },
  methods: {
    goToBoard(board) {
      this.isLoggedIn = true;
      this.board = board;
    }
  },
  created() {
    const user = storage.getUser();
    if (!user) {
      this.isLoggedIn = false;
    }
  }
};
</script>

<style>
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
</style>
