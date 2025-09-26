<template>
  <p style="height: 37.5px;">이 글을 보신당신 베이즈 url에 /slimer 을 붙여라</p>
  <p>암호화:{{encoded}} 해석:{{decoded}}</p>
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
      encoded: this.$route.params.userid,
      decoded: atob(decodeURIComponent(this.$route.params.userid))
    }
  },
  methods: {

  },
  mounted() {
    
  },
  watch: {
    '$route.params.userid'(newId, oldId) {
      console.log("userid 변경:", oldId, "→", newId)
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
