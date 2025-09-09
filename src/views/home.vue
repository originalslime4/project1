<template>
  <div class="home">
    <a @click="rerod">카르마 슬라임</a>
    <b>알림</b>
    <span @click="menu=!menu">三{{menu}}</span>
    <img src="../assets/propil.jpg" class="propil" style="height: 37.5px;position: absolute;top: 50%;right:0;transform: translate(-20px, -50%);" />
    <div class="menu" v-if="menu">
      <p style="top: 0px" @click="goto='/home'">홈</p>
      <p style="top: 60px">개발게임</p>
      <p style="top: 120px">게시판</p>
      <p style="top: 180px" @click="goto='/jjal'">짤방</p>
      <p style="top: 240px">채팅</p>
    </div>
  </div>

  <div v-for="i in 1000" :key="i">
    <h1>대충 엄청난 스토리</h1>
  </div>
  <div id="app">
    <router-view />
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="어서오시오 젊은이"/> -->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import axios from "axios";
export default {
  name: 'homePage',
  setup() {
    return {
    }
  },
  data(){
    return {
      menu:false,
      loggedIn: false,
      goto:""
    }
  },
  methods: {
    rerod() {
    this.$router.push({ path: '/reload', query: {place:"/home"} });
    },
     async checkLogin() {
  try {
    const res = await axios.get("/auth/check", {
      withCredentials: true
    });
    this.loggedIn = res.data.loggedIn;
  } catch (err) {
    console.error("로그인 확인 실패:", err);
    this.loggedIn = false;
  }
},
  },
  watch: {
    goto(newVal) {
      this.$router.push(newVal)
    },
  },
  components: {
    // HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.home {
  right: 0;
  top: 0;
  width: 100%;
  background: rgb(0, 200, 0);
  border-radius: 5px;
  position: fixed;
}
.home a{
  color: black;
  font-size: 37.5px;
  font-weight: 1000;
}
.home b{
  background: #ffffff;
  color: black;
  font-size: 25px;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(-75px, -50%);
  border-radius: 10px;
  padding: 5px;
}
.home span{
  color: black;
  font-size: 37.5px;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(25px, -50%);
  font-weight: 1000;
}
.menu {
  background: rgb(0, 175, 0);
  position: absolute;
  top: 100%;
  width: 200px;
  height: 1000px;
}
.menu p{
  background: rgb(0, 175, 0);
  color: black;
  width: 100%;
  height: 50px;
  font-size: 250%;
  font-weight: 1000;
  border-color: #000000;
  border-bottom-style: outset;
  border-top-style: inset;
  left: 0px;
  display: flex;
  align-items: center;      /* 세로 중앙 */
  justify-content: center;  /* 가로 중앙 */
  text-align: center;
  margin: 0;
}
.propil {
  background: #000000;
  border-radius: 100%;
  padding: 5px;
}
</style>
