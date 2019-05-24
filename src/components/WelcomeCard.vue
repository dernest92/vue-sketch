<template>
  <div class="container">
    <div class="card">
      <div class="join-options">
        <input type="text" placeholder="Your Name" v-model="newUserName">
        <button @click="setUserName()">Enter</button>
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
      boardNames: []
    };
  },
  sockets: {},
  computed: {},
  methods: {
    setUserName() {
      storage.setUser({ name: this.newUserName });
      this.$emit("goToPage", "board-select");
    },
    setMenuState(state) {
      console.log(state);
      this.menuState = state;
    }
  }
};
</script>


<style lang="scss" scoped>
</style>
