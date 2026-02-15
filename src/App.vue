<template>
  <div class="home" :class="{ 'scrolled': isScrolled[0] }">
    <a @click="rerod">{{ mainname }}</a>
    <b>알림</b>
    <span @click="menu = !menu">三</span>
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
    <div class="menu" :class="{ 'clmu': !menu }">
      <p @click="goto = '/home'">홈</p>
      <p>개발게임</p>
      <p @click="goto = `/propil/${discode('original.slime5@gmail.com',true)}`">게시판</p>
      <p @click="goto = '/jjal'">짤방</p>
      <p @click="goto = `/propil/${discode('original.slime4@gmail.com',true)}`">채팅</p>
    </div>
    <div class="menu2" :class="{ 'clmu': !pril }">
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
      <p @click="goto = `/propil/${discode(userinfo.userEmail,true)}`">내페이지</p>
      <p>팔로우중</p>
      <p>환경설정</p>
      <p>내가쓴글</p>
      <p>스튜디오</p>
      <p @click="logout">로그아웃</p>
    </div>
  </div>
  <div id="app">
    <router-view />
    <h1>{{}}</h1>
    <img style="width:250px;height:250px;" alt="Vue logo" src="./assets/omegatrus.png">
    <Wearedevs msg="카르마 슬라임" style="background:rgb(200,200,200);"/>
  </div>
</template>

<script>
import axios from "axios";
axios.defaults.baseURL = "https://kmslime.kr";
axios.defaults.withCredentials = true;
// const api = axios.create({
//   baseURL: "/",
//   withCredentials: true
// });

import HelloWorld from './components/HelloWorld'
import Wearedevs from './components/myhouse'
export default {
  name: "AppPage",
  setup() {
    return {};
  },
  data() {
    return {
      limbtt: 0,
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
        create:"",
        config:{}
      },
      following: [],
      server:{
        "/":"여기 홈 아닌데요",
        "/jjal":Math.random() < 0.5 ? "이런짤 슬라임" : "저런짤 슬라임",
        "/home":"카르마 슬라임",
        "/propil":"엄...님아?",
        "/propil/":"없는데요;;",
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
discode(str, encode) {
      if (encode) {
        return btoa(unescape(encodeURIComponent(str)))
      } else {
        return decodeURIComponent(escape(atob(str)))
      }
    },
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
      this.limbtt += 1;
      if (HelloWorld[this.limbtt]) {alert(HelloWorld[this.limbtt]);}
      if (this.limbtt==1){
      this.$router.push({ path: "/reload", query: { place: window.location.pathname } });
      }
      var last=this.limbtt
      setTimeout(() => {
      if (last==this.limbtt){this.limbtt = 0;}
      }, Math.min(last*250+250,5000));
    },
    async logout() {
      try {
        await axios.get("/logout");
        this.userinfo= {
        loggedIn:false,
        userName: "Unknown",
        userEmail: "abcdefg1234@gmail.com",
        userPicture: "",
        bio: "슬라임의 노예☆입니다",
        followers: 0,
        create:"",
        config:{}
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
          this.userinfo.create=res.data.create;
          this.userinfo.followers=res.data.followers;
          this.userinfo.config=res.data.config
        }
      } catch (err) {
        console.error("로그인 확인 실패:", err);
        this.userinfo.loggedIn = false;
        this.userinfo.userEmail = "";
        this.userinfo.userPicture = "";
        this.userinfo.userName = "";
        this.userinfo.bio = "";
        this.userinfo.create="";
        this.userinfo.followers=0;
        this.userinfo.config={};
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
      }
    else if (to.matched.some(r => r.path === '/propil/:userid')) {
      this.mainname = "이것은 슬라임"
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
  components: {
    Wearedevs
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
  transition: transform 0.1s ease;
}
.home.scrolled {
  transform: translateY(-100%); /* 위로 올리기 */
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
  transition: transform 0.1s ease;
}
.menu.clmu{
  transform: translateX(-100%);
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
  transition: transform 0.1s ease;
}
.menu2.clmu{
  transform: translateX(100%);
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