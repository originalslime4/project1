<template>
  <p style="height: 37.5px;">이 글을 보신당신 베이즈 url에 /slimer 을 붙여라</p>
  <div style="display: flex; align-items: center; gap: 10px;">
      <img
        :src="otherinfo.userPicture"
        class="propil"
        @error="handleImageError($event, 'prl')"
        style="object-fit: cover; width: 150px; height: 150px; margin: 0; border-radius: 50%;"
      />
      <div style="display: flex; flex-direction: column;align-items: flex-start;word-break: break-all;">
    <span style="font-size:50px;">{{ otherinfo.userName }}</span>
    <span>{{ otherinfo.bio }}</span>
  </div>
  <button :style="{padding: '10px 24px',fontSize: '15px',border: '5px solid '+(likeviwe ===-1?'red':'black')}" @click="like(files[indfile[0]]._id, false, false);likeviwe=(likeviwe==-1)?0:-1;;">비추천</button>
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
//import HelloWorld from '../components/HelloWorld'
export default {
  name: "propilPage",
  setup() {
    return {};
  },
  data() {
    return {
      coded: this.discode(this.$route.params.userid,false),
      otherinfo:{
        loggedIn: false,
        userName: "Unknown",
        userEmail: "abcdefg1234@gmail.com",
        userPicture: "",
        bio: "슬라임의 노예☆입니다",
      },
    }
  },
  methods: {
    handleImageError(e, t) {
      if (t == "img") {
        e.target.src = require("../assets/non.png"); // 또는 절대 경로
      } else if (t == "prl") {
        e.target.src = require("../assets/propil.jpg");
      }
    },
    discode(str, encode) {
      if (encode) {
        return btoa(unescape(encodeURIComponent(str)))
      } else {
        return decodeURIComponent(escape(atob(str)))
      }
    },
       async getuse(iml) {
  try {
    const res = await axios.get("/userdata", {
      params: { email: iml },
      withCredentials: true // 세션 기반 인증 시 필요
    });
    this.otherinfo.userEmail = res.data.email;
    this.otherinfo.userPicture = res.data.picture;
    this.otherinfo.userName = res.data.nickname;
    this.otherinfo.bio = res.data.bio;
    console.log("사용자 정보:", this.otherinfo);
  } catch (err) {
    console.error("사용자 정보 가져오기 실패:", err);
    alert("사용자 정보를 불러오지 못했습니다.");
  }
},
  },
  mounted() {
    
  },
  watch: {
    '$route.params.userid'(newId, oldId) {
      console.log("userid 변경:", oldId, "→", newId)
      this.coded= this.discode(this.$route.params.userid,false)
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
</style>//할일 프로필 연령제한
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
