<template>
  <div class="home">
    <a @click="rerod">카르마 슬라임</a>
    <b>알림</b>
    <c @click="menu = !menu">三{{ menu }}</c>
    <img src="./assets/propil.jpg" class="propil" />
    <div class="menu" v-if="menu">
      <router-link class="lk" style="top: 0px" to="/home">홈</router-link>
      <router-link class="lk" style="top: 60px">개발된 게임</router-link>
      <router-link class="lk" style="top: 120px">게시판</router-link>
      <router-link class="lk" style="top: 180px" to="/jjal">짤방</router-link>
      <router-link class="lk" style="top: 240px">채팅</router-link>
    </div>
  </div>
  <div id="app">
    <router-view />
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="어서오시오 젊은이"/> -->
  </div>
</template>

<script>
import axios from "axios";
// import HelloWorld from './components/HelloWorld.vue'
export default {
  name: "App",
  mounted() {
    // var go = this.$route.query.place;
    // if (go) {
    //   this.$router.push(this.$route.query.place);
    // } else {
    //   this.$router.push("/home");
    // }
  },
  setup() {
    return {};
  },
  data() {
    return {
      menu: false,
    };
  },
   methods: {
    rerod() {
      this.$router.push({ path: "https://project1-n922.onrender.com/reload", query: { place: "/home" } });
    },
    async checkLogin() {
  try {
    const res = await axios.get("https://project1-n922.onrender.com/auth/check", {
      withCredentials: true
    });
    this.loggedIn = res.data.loggedIn;
  } catch (err) {
    console.error("로그인 확인 실패:", err);
    this.loggedIn = false;
  }
},
  },
  components: {
    // HelloWorld
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
.home {
  right: 0;
  top: 0;
  width: 100%;
  background: rgb(0, 200, 0);
  border-radius: 5px;
  position: fixed;
}
.home a {
  color: black;
  font-size: 37.5px;
  font-weight: 1000;
}
.home b {
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
.home c {
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
.lk {
  background: rgb(0, 175, 0);
  color: black;
  font-size: 25px;
  font-weight: 1000;
  position: absolute;
  width: 200px;
  border-color: #000000;
  border-bottom-style: outset;
  border-top-style: inset;
  left: 0px;
}
.propil {
  background: #000000;
  border-radius: 100%;
  height: 37.5px;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(-20px, -50%);
  padding: 5px;
}
</style>
