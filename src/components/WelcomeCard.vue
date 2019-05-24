<template>
  <div class="container">
    <div class="card">
      <h2>Welcome!</h2>
      <div class="join-options">
        <form @submit.prevent="setUserName">
          <div class="input-with-addon">
            <input
              type="text"
              placeholder="Enter Your Name..."
              v-model="newUserName"
              required
              maxlength="25"
            >
            <div class="input-addon">{{newUserName.length}}/25</div>
          </div>
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
      newUserName: "",
      boardNames: []
    };
  },
  sockets: {},
  computed: {},
  methods: {
    setUserName() {
      const id = Math.ceil(Math.random() * 1000000);
      storage.setUser({ name: this.newUserName, id });
      this.$emit("goToPage", "board-select");
    },
    setMenuState(state) {
      console.log(state);
      this.menuState = state;
    }
  }
};
</script>

