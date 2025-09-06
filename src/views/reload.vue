<template>
  <h1>로딩중학교</h1>
</template>

<script>
export default {
  name: "Reloding",
  mounted() {
    var go = this.$route.query.place;
    if (go) {
      this.$router.push(this.$route.query.place);
    } else {
      this.$router.push("/home");
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
