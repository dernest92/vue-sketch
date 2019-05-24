<template>
  <div class="container">
    <div class="card">
      <div class="join-options">
        <form @submit.prevent="setUserName">
          <input type="text" placeholder="Your Name..." v-model="newUserName">
          <button class="btn" type="submit">Enter</button>
        </form>
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
.card {
  padding: 20px 10px;
}
</style>
