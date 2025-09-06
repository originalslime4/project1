<template>
  <div class="home">
    <a @click="rerod">{{ Math.random() < 0.5 ? "이런짤" : "저런짤" }} 슬라임</a>
    <b>알림</b>
    <c @click="menu = !menu">三{{ menu }}</c>
    <img src="../assets/propil.jpg" class="propil" />
    <div class="menu" v-if="menu">
      <router-link class="lk" style="top: 0px" to="/home">홈</router-link>
      <router-link class="lk" style="top: 60px">개발된 게임</router-link>
      <router-link class="lk" style="top: 120px">게시판</router-link>
      <router-link class="lk" style="top: 180px" to="/jjal">짤방</router-link>
      <router-link class="lk" style="top: 240px">채팅</router-link>
    </div>
  </div>
  <div>
    <h1>d</h1>
  </div>
  <div v-if="!loggedIn" style="margin: 20px">
  <button @click="loginWithGoogle">Google 로그인</button>
</div>

  <div>
    <input type="file" @change="onFileChange" accept="image/*,video/gif" />
    <input v-model="title" placeholder="제목" />
    <input v-model="name" placeholder="이름" />
    <button @click="uploadFile">업로드</button>

    <div class="image-grid">
      <div v-for="item in files" :key="item.id">
        <img :src="item.url" />
        <p>{{ item.title }} - {{ item.name }}</p>
        <small>{{ item.createdAt }}</small>
      </div>
    </div>
  </div>

  <!-- <div v-for="i in 1000" :key="i">
    <h1>대충 엄청난 스토리</h1>
  </div> -->
  <div id="app">
    <router-view />
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="어서오시오 젊은이"/> -->
  </div>
</template>

<script>
import axios from "axios";
// const api = axios.create({
//   baseURL: "/",
//   withCredentials: true
// });

// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: "jallPage",
  setup() {
    return {};
  },
  data() {
    return {
      menu: false,
      file: null,
      title: "",
      name: "",
      files: [],
      loggedIn: false,
    };
  },
  methods: {
    rerod() {
      this.$router.push({ path: "/", query: { place: "/jjal" } });
    },
    onFileChange(e) {
      this.file = e.target.files[0];
    },
    async uploadFile() {
      if (!this.loggedIn) {
        alert("로그인 후 업로드 가능합니다.");
        return;
      }

      const formData = new FormData();
      formData.append("file", this.file);
      formData.append("title", this.title);
      formData.append("name", this.name);

      try {
        const res = await axios.post("/upload", formData);
console.log(res.data); // 또는 다른 용도로 사용

        this.getFiles();
      } catch (err) {
        alert("업로드 실패: " + err.response?.data?.error || err.message);
      }
    },
    async getFiles() {
      const res = await axios.get("/files");
      this.files = res.data;
    },
    async checkLogin() {
      try {
        await axios.get("/auth/check");
        this.loggedIn = true;
      } catch {
        this.loggedIn = false;
      }
    },
    loginWithGoogle() {
      window.location.href = "/login";
    },

  },
  mounted() {
    this.checkLogin();
    this.getFiles();
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
.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}
.image-grid img {
  min-width: 100px;
  max-width: 100px;
  width: fit-content;
  height: fit-content;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
</style>
// git add .
// git commit -m "버그"
// git push origin main