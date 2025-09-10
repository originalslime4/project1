<template>
  <div class="home">
    <a @click="rerod">{{ Math.random() < 0.5 ? "이런짤" : "저런짤" }} 슬라임</a>
    <b>알림</b>
    <span @click="menu = !menu">三{{ menu }}</span>
    <img src="../assets/propil.jpg" class="propil" style="height: 37.5px;position: absolute;top: 50%;right:0;transform: translate(-20px, -50%);" />
    <div class="menu" v-if="menu">
      <p @click="goto='/home'">홈</p>
      <p>개발게임</p>
      <p>게시판</p>
      <p @click="goto='/jjal'">짤방</p>
      <p>채팅</p>
    </div>
    <div class="menu2" v-if="false">
      <div style="padding:10px">
        <img src="../assets/propil.jpg" class="propil" style="width: 37.5%;top:0;left:0;" />
        <h3>
          {{profile[2]}}
        </h3>
      </div>
      <p>홈</p>
      <p>개발게임</p>
      <p>게시판</p>
      <p>짤방</p>
      <p>채팅</p>
    </div>
  </div>
  <div>
    <h1>d</h1>
  </div>
  <div v-if="!userinfo.loggedIn" style="margin: 20px">
    <button @click="loginWithGoogle">Google 로그인</button>
  </div>

  <div>
    <input type="file" @change="onFileChange" accept="image/*,video/gif" />
    <input v-model="title" placeholder="제목" />
    <input v-model="name" placeholder="이름" />
    <button @click="uploadFile">업로드</button>

    <div class="image-grid">
      <div v-for="item in files" :key="item.id">
        <img
          :src="convertDriveLinkToThumbnail(item.url)"
          alt="슬라임 이미지"
        ><!-- @error="handleImageError($event)" -->

        <p>{{ item.title }} - {{ item.name }}</p>
        <small>{{ item.createdAt }}</small>
      </div>
    </div>
  </div>
<div class="pagination">
  <button @click="prevPage" :disabled="serchinfo.currentPage === 1">이전</button>
  <span>{{ serchinfo.currentPage }} / {{ serchinfo.totalPages }}</span>
  <button @click="nextPage" :disabled="serchinfo.currentPage === serchinfo.totalPages">다음</button>
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
axios.defaults.withCredentials = true;
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
      goto:"",
      userinfo:{loggedIn:false,userName:"",userEmail:"",userPicture:""},
      serchinfo:{searchKeyword: "",currentPage: 1,totalPages: 1}
    };
  },
  methods: {
    convertDriveLinkToThumbnail(originalUrl, size = 1000) {
      const match = originalUrl.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]{25,})/);
      if (!match) return null;

      const fileId = match[1];
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
    },
    handleImageError(e) {
      e.target.src = require("../assets/non.png"); // 또는 절대 경로
    },

    rerod() {
      this.$router.push({ path: "/reload", query: { place: "/jjal" } });
    },
    onFileChange(e) {
      this.file = e.target.files[0];
    },
    async uploadFile() {
      if (!this.userinfo.loggedIn) {
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
  const res = await axios.get("https://project1-n922.onrender.com/files", {
    params: {
      page: this.serchinfo.currentPage,
      q: this.serchinfo.searchKeyword
    }
  });

  this.files = res.data.files;
  this.serchinfo.totalPages = res.data.totalPages;
},
    async checkLogin() {
  try {
    const res = await axios.get("https://project1-n922.onrender.com/auth/check", {
      withCredentials: true,
    });
    this.userinfo.loggedIn=res.data.loggedIn;
    if (res.data.loggedIn) {
      this.userinfo.userName = res.data.name;
      this.userinfo.userEmail = res.data.email;
      this.userinfo.userPicture = res.data.picture;
    }
  } catch (err) {
    console.error("로그인 확인 실패:", err);
    this.userinfo.loggedIn = false;
    this.userinfo.userName = "";
    this.userinfo.userEmail = "";
    this.userinfo.userPicture = "";
  }
},
    loginWithGoogle() {
      window.location.href = "https://project1-n922.onrender.com/login";
    },
    prevPage() {
    if (this.serchinfo.currentPage > 1) {
      this.serchinfo.currentPage--;
      this.getFiles();
    }
  },
  nextPage() {
    if (this.serchinfo.currentPage < this.serchinfo.totalPages) {
      this.serchinfo.currentPage++;
      this.getFiles();
    }
  }
  },
  watch: {
    goto(newVal) {
      this.$router.push(newVal)
    },
  },

  created() {
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
.menu2 p{
  background: rgb(255, 255, 255);
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