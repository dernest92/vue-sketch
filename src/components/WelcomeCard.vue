<template>
  <div class="container">
    <div class="card">
      <h2>Welcome!</h2>
      <div class="join-options">
        <form @submit.prevent="setUserName">
          <input type="text" placeholder="Enter Your Name..." v-model="newUserName" required>
          <button class="btn bg-green clr-white" type="submit">Enter</button>
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

