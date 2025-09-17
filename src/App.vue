<template>
  <div class="home" :class="{ 'scrolled': isScrolled[0] }">
    <a @click="rerod">{{ mainname }}</a>
    <b>알림</b>
    <span @click="menu = !menu">三{{ menu }}</span>
    <img
      @click="
        if (this.userinfo.loggedIn) {
          pril = !pril;
        } else {
          loginWithGoogle();
        }
      "
      :src="userinfo.userPicture"
      class="propil"
      @error="handleImageError($event, 'prl')"
      style="
        object-fit: cover;
        height: 37.5px;
        width: 37.5px;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(-20px, -50%);
      "
    />
    <div class="menu" v-if="menu">
      <p @click="goto = '/home'">홈</p>
      <p>개발게임</p>
      <p>게시판</p>
      <p @click="goto = '/jjal'">짤방</p>
      <p>채팅</p>
    </div>
    <div class="menu2" v-if="pril">
      <div style="padding: 10px">
        <img
          :src="userinfo.userPicture"
          class="propil"
          @error="handleImageError($event, 'prl')"
          style="object-fit: cover; width: 75px; height: 75px; margin: 0"
        />
        <h3 style="word-break: break-word; margin: 0">
          {{ userinfo.userName }}
        </h3>
        <h3 style="word-break: break-word; margin: 0">
          -ers:{{ userinfo.followers }} ; -ing:{{ following.length }}
        </h3>
        <h6 style="word-break: break-word; margin: 0">
          {{ userinfo.userEmail }}
        </h6>
      </div>
      <p>내페이지</p>
      <p>팔로우중</p>
      <p>환경설정</p>
      <p>내가쓴글</p>
      <p>스튜디오</p>
      <p @click="logout">로그아웃</p>
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
axios.defaults.baseURL = "https://project1-n922.onrender.com";
axios.defaults.withCredentials = true;
// const api = axios.create({
//   baseURL: "/",
//   withCredentials: true
// });

// import HelloWorld from './components/HelloWorld.vue'
export default {
  name: "AppPage",
  setup() {
    return {};
  },
  data() {
    return {
      mainname:"여기 홈 아닌데요",
      menu: false,
      pril: false,
      isScrolled: [false,100],
      goto: "",
      userinfo: {
        loggedIn: false,
        userName: "Unknown",
        userEmail: "abcdefg1234@gmail.com",
        userPicture: "",
        bio: "슬라임의 노예☆입니다",
        followers: 0,
      },
      following: [],
      server:{
        "/":"여기 홈 아닌데요",
        "/jjal":Math.random() < 0.5 ? "이런짤 슬라임" : "저런짤 슬라임",
        "/home":"카르마 슬라임"
        }
    };
  },
  methods: {
  //   convertDriveLinkToThumbnail(originalUrl, size = 1000) {
  //     const match = originalUrl.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]{25,})/);
  //     if (!match) return null;

  //     const fileId = match[1];
  //     return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
  //   },
    handleImageError(e, t) {
      if (t == "img") {
        e.target.src = require("./assets/non.png"); // 또는 절대 경로
      } else if (t == "prl") {
        e.target.src = require("./assets/propil.jpg");
      }
    },
handleScroll() { 
      this.isScrolled[0] = window.scrollY >= this.isScrolled[1];
      this.isScrolled[1]=Math.min(Math.max(this.isScrolled[1], window.scrollY-100), window.scrollY+100);
    },
    rerod() {
      this.$router.push({ path: "/reload", query: { place: window.location.pathname } });
    },
    async logout() {
      try {
        await axios.get("/logout");
        this.userinfo = {
          loggedIn: false,
          userName: "Unknown",
          userEmail: "abcdefg1234@gmail.com",
          userPicture: "",
          bio: "슬라임의 노예☆입니다",
          followers: 0,
        };
        this.following = [];
        alert("로그아웃 되었습니다.");
        //this.$router.push("/home");
      } catch (err) {
        alert("로그아웃 실패: " + (err.response?.data?.error || err.message));
      }
    },
    async checkLogin() {
      try {
        const res = await axios.get("/auth/check", {
          withCredentials: true,
        });
        this.userinfo.loggedIn = res.data.loggedIn;
        if (res.data.loggedIn) {
          this.userinfo.userEmail = res.data.email;
          this.userinfo.userPicture = res.data.picture;
          this.userinfo.userName = res.data.nickname;
          this.userinfo.bio = res.data.bio;
        }
      } catch (err) {
        console.error("로그인 확인 실패:", err);
        this.userinfo.loggedIn = false;
        this.userinfo.userEmail = "";
        this.userinfo.userPicture = "";
        this.userinfo.userName = "";
        this.userinfo.bio = "";
      }
    },
    loginWithGoogle() {
      window.location.href = "/login";
    },
    async getFollowData() {
      try {
        const res = await axios.get("/following");
        this.following = res.data;
      } catch (err) {
        console.error("팔로우 정보 조회 실패:", err);
        this.following = [];
      }
    },
  },
  watch: {
    $route(to, from) {
      this.menu=false
      this.pril=false
      console.log("라우트 변경됨:", from.path, "→", to.path);
      if (to.path in this.server){
        this.mainname=this.server[to.path]
      }else{
        this.mainname="꺄아악 어딜보는거에욧!";
      }
    },
    goto(newVal) {
      this.$router.push(newVal);
    },
  },

  mounted() {
    this.checkLogin();
    this.getFollowData();
  window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  // components: {
  //   // HelloWorld
  // },
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
  transition: transform 0.1s ease;

}
.home.scrolled {
  transform: translateY(-50px); /* 위로 올리기 */
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
.home span {
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
.menu p {
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
  align-items: center; /* 세로 중앙 */
  justify-content: center; /* 가로 중앙 */
  text-align: center;
  margin: 0;
}
.menu2 {
  background: rgb(255, 255, 255);
  border-radius: 10px;
  border-style: inset;
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  height: 500px;
}
.menu2 p {
  background: rgb(255, 255, 255);
  color: black;
  width: 100%;
  height: 50px;
  font-size: 250%;
  font-weight: 1000;
  border-color: #000000;
  border-bottom-style: outset;
  border-top-style: inset;
  border-radius: 10px;
  left: 0px;
  display: flex;
  align-items: center; /* 세로 중앙 */
  justify-content: center; /* 가로 중앙 */
  text-align: center;
  margin: 0;
}
.propil {
  background: #000000;
  border-radius: 100%;
  padding: 5px;
}
</style>
// git add .
// git commit -m "버그"
// git push origin main 