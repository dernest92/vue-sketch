<template>
  <div class="container">
    <div class="card">
      <div class="join-options">
        <button class="join-option" @click="goToPage('new-board')">Create a new board</button>
        <button class="join-option" @click="goToPage('existing-boards')">Join an existing board</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goToPage(page) {
      this.$emit("goToPage", page);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
