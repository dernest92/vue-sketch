<template>
  <div id="app">
    <SketchPad id="sketch-pad"/>
  </div>
</template>

<script>
import SketchPad from "./components/SketchPad.vue";

export default {
  name: "app",
  components: {
    SketchPad
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

#sketch-pad {
  border: 1px #333 solid;
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
</style>
