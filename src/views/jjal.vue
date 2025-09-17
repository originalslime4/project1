<template>
  <p style="height: 37.5px;">이 글을 보신당신 베이즈 url에 /slimer 을 붙여라</p>
  <div>
    <p>짤 하나를 올리기 위해선 최소 30분간의 공백이 필효합니다.</p>
    <input type="file" @change="onFileChange" accept="image/*,video/gif" />
    <img scr="{{file}}" @error="handleImageError($event, 'img')" />
    <input v-model="title" placeholder="제목 (25자)" maxlength="25" />
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
      <div @click="reload" v-for="item in files" :key="item.id">
        <div class="imagecard">
          <img
            :src="convertDriveLinkToThumbnail(item.url)"
            alt="슬라임 이미지"
            @error="handleImageError($event, 'img')"
          />
        </div>
        <p>{{ item.title }}</p>
        <p style="font-size:10px;">{{ new Date(item.createdAt).toLocaleString() }}</p>
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
  name: "jallPage",
  setup() {
    return {};
  },
  data() {
    return {
      file: null,
      title: "",
      stat: "업로드",
      files: [{_id:"68c4cb8183fac5249c2d76a1",
title:"새 시대",
email:"original.slime4@gmail.com",
url:"https://drive.google.com/uc?id=1xtY8Lrzo-Ndf_ZfnfxP6N8g6aX068Ceq",
like:0,
createdAt:"2025-09-13T01:40:17.081+00:00"},
{_id:"68c4e2ceae8a37fbee15b656",
title:"혁명은 바람과도 같지, 늘 내곁에 있으니",
email:"original.slime4@gmail.com",
url:"https://drive.google.com/uc?id=1CKC-WTbTwTNXkpH_qYhk13T8UYG8z-rj",
like:0,
createdAt:"2025-09-13T03:19:42.738+00:00"}],
      goto: "",
      userinfo: {
        loggedIn: false,
        userName: "Unknown",
        userEmail: "abcdefg1234@gmail.com",
        userPicture: "",
        bio: "슬라임의 노예☆입니다",
      },
      serchinfo: { searchKeyword: "", currentPage: 1, totalPages: 1 },
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
    onFileChange(e) {
      this.file = e.target.files[0];
    },
    async checkUploadPermission(path, email, min) {
      try {
        const res = await axios.get("/limittime", {
          params: { path, email, min },
        });
        if (!res.data.allowed) {
          alert(`${res.data.remaining}분 후에 다시 업로드 가능`);
          return false;
        }
        return true;
      } catch (err) {
        alert(
          "업로드 가능 여부 확인 실패: " +
            (err.response?.data?.error || err.message)
        );
        return false;
      }
    },
    async filetourl() {
      if (!this.userinfo.loggedIn) {
        alert("로그인 후 업로드 가능");
        return null;
      }
      const formData = new FormData();
      formData.append("file", this.file);

      try {
        const res = await axios.post("/upload-file-drive", formData);
        return res.data.url; // 업로드된 파일의 URL 반환
      } catch (err) {
        alert(
          "드라이브 업로드 실패: " + (err.response?.data?.error || err.message)
        );
        return null;
      }
    },

    async uploadFile() {
      if (this.stat != "업로드") return;
      this.stat = "올리는중";
      const canUpload = await this.checkUploadPermission(
        "jjal",
        this.userinfo.userEmail,
        30
      );
      if (!canUpload) {
        this.stat = "업로드";
        return;
      }
      const fileUrl = await this.filetourl(); // 먼저 업로드 수행
      if (!fileUrl) return; // 업로드 실패 시 중단
      const payload = {
        title: this.title,
        email: this.userinfo.userEmail,
        url: fileUrl,
      };
      try {
        await axios.post("/upload-jjal", payload);
        alert("짤 업로드 성공");
        this.getFiles(); // 목록 갱신
      } catch (err) {
        alert("DB 저장 실패: " + (err.response?.data?.error || err.message));
      }
      this.stat = "업로드";
    },
    async getFiles() {
      const res = await axios.get("/jjals", {
        params: {
          page: this.serchinfo.currentPage,
          q: this.serchinfo.searchKeyword,
        },
      });
      this.files = res.data.files;
      this.serchinfo.totalPages = res.data.totalPages;
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
    },
  },
  watch: {
    goto(newVal) {
      this.$router.push(newVal);
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
.image-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.image-grid img {
  max-height: 375px;
  width: fit-content;
  height: fit-content;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
.imagecard{
  background: rgb(200, 200, 200);
  width: 150px;
  max-height: 375px;
  min-height: 100px;
}
.image-grid p {
  margin: 0;
  text-align: left;
  word-break: break-all;
  width: 150PX;
}
</style>//할일 프로필 연령제한 헤더
// git add .
// git commit -m "버그"
// git push origin main 
// async updateUserInfo(nickname, bio, picture) {
//     try {
//       const res = await axios.put("/user", { nickname, bio, picture });
//       return res.data.success;
//     } catch (err) {
//       console.error("사용자 정보 수정 실패:", err);
//       return false;
//     }
//   },
// async followUser(targetEmail) {
//     try {
//       const res = await axios.post(`/follow/${targetEmail}`);
//       return res.data.success;
//     } catch (err) {
//       console.error("팔로우 실패:", err);
//       return false;
//     }
//   },
// async unfollowUser(targetEmail) {
//     try {
//       const res = await axios.delete(`/follow/${targetEmail}`);
//       return res.data.success;
//     } catch (err) {
//       console.error("언팔로우 실패:", err);
//       return false;
//     }
//   },
