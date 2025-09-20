<template>
  <p style="height: 37.5px;">이 글을 보신당신 베이즈 url에 /slimer 을 붙여라</p>
  현재 "홈"은 업데이트 되지 않았습다 짤이나봐라
  <!-- <div v-if="!userinfo.loggedIn" style="margin: 20px">
    <button @click="loginWithGoogle">Google 로그인</button>
  </div>

  <div>
    <p>짤 하나를 올리기 위해선 최소 30분간의 공백이 필효합니다.</p>
    <input type="file" @change="onFileChange" accept="image/*,video/gif" />
    <img scr="{{file}}" @error="handleImageError($event, 'img')" />
    <input v-model="title" placeholder="제목" />
    <button @click="uploadFile">업로드</button>
    <div style="margin: 20px">
      <input
        v-model="serchinfo.searchKeyword"
        @keyup.enter="getFiles"
        placeholder="검색어를 입력하세요"
        style="padding: 5px; width: 50%"
      />
      <button @click="getFiles" style="margin-left: 10px">검색</button>
    </div>

    <div class="image-grid">
      <div v-for="item in files" :key="item.id">
        <img
          :src="convertDriveLinkToThumbnail(item.url)"
          alt="슬라임 이미지"
          @error="handleImageError($event, 'img')"
        />
        <p>{{ item.title }}</p>
        <small>{{ item.createdAt }}</small>
      </div>
    </div>
  </div>
  <div class="pagination">
    <button @click="prevPage" :disabled="serchinfo.currentPage === 1">
      이전
    </button>
    <span>{{ serchinfo.currentPage }} / {{ serchinfo.totalPages }}</span>
    <button
      @click="nextPage"
      :disabled="serchinfo.currentPage === serchinfo.totalPages"
    >
      다음
    </button>
  </div> -->
</template>

<script>
import axios from "axios";
axios.defaults.baseURL = "https://www.kmslime.kr";
axios.defaults.withCredentials = true;
// const api = axios.create({
//   baseURL: "/",
//   withCredentials: true
// });

//import HelloWorld from './components/HelloWorld.vue'
export default {
  name: "jallPage",
  setup() {
    return {};
  },
  data() {
    return {
      title: "",
      stat: "업로드",
      files: [],
      goto: "",
      userinfo: {
        loggedIn: false,
        userName: "Unknown",
        userEmail: "abcdefg1234@gmail.com",
        userPicture: "",
        bio: "슬라임의 노예☆입니다",
        followers: 0,
      },
      serchinfo: { searchKeyword: "", currentPage: 1, totalPages: 1 },
      following: [],
    };
  },
  methods: {
    convertDriveLinkToThumbnail(originalUrl, size = 1000) {
      const match = originalUrl.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]{25,})/);
      if (!match) return null;

      const fileId = match[1];
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
    },
    handleImageError(e, t) {
      if (t == "img") {
        e.target.src = require("../assets/non.png"); // 또는 절대 경로
      } else if (t == "prl") {
        e.target.src = require("../assets/propil.jpg");
      }
    },

    rerod() {
      this.$router.push({ path: "/reload", query: { place: "/jjal" } });
    },
    // async getFiles() {
    //   const res = await axios.get("/jjals", {
    //     params: {
    //       page: this.serchinfo.currentPage,
    //       q: this.serchinfo.searchKeyword,
    //     },
    //   });
    //   this.files = res.data.files;
    //   this.serchinfo.totalPages = res.data.totalPages;
    // },
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
    // prevPage() {
    //   if (this.serchinfo.currentPage > 1) {
    //     this.serchinfo.currentPage--;
    //     this.getFiles();
    //   }
    // },
    // nextPage() {
    //   if (this.serchinfo.currentPage < this.serchinfo.totalPages) {
    //     this.serchinfo.currentPage++;
    //     this.getFiles();
    //   }
    // },
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
    goto(newVal) {
      this.$router.push(newVal);
    },
  },

  mounted() {
    this.checkLogin();
    // this.getFiles();
    this.getFollowData();
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
</style>
// git add .
// git commit -m "버그"
// git push origin main 