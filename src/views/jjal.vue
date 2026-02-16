<template>
  <p style="height: 37.5px;">이 글을 보신당신 베이즈 url에 /slimer 을 붙여라</p>
  <div>
    <p>짤 하나를 올리기 위해선 최소 30분간의 공백이 필효합니다.</p>
    <input type="file" @change="onFileChange" accept="image/*,video/gif" />
    <!-- <img style="width:25px;height:25px;object-fit: contain;" :scr="file" @error="handleImageError($event, 'img')" /> -->
    <input v-model="title" placeholder="제목 (25자)" maxlength="25" />
    <button @click="timeout(uploadFile)">업로드</button>
    <div style="margin: 20px">
      <input
        v-model="serchinfo.searchKeyword"
        @keyup.enter="timeout(getFiles)"
        placeholder="검색어를 입력하세요"
        style="padding: 5px; width: 50%"
      />
      <button @click="timeout(getFiles)" style="margin-left: 10px">검색</button>
    </div>

    <div class="image-grid">
      <div v-for="(item, index) in files" :key="item.id" @click="indfile[0]=index;this.getuse(item.email);timeout(openui)">
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
    <button @click="timeout(prevPage)" :disabled="serchinfo.currentPage === 1">
      이전
    </button>
    <span>{{ serchinfo.currentPage }} / {{ serchinfo.totalPages }}</span>
    <button @click="timeout(nextPage)" :disabled="serchinfo.currentPage === serchinfo.totalPages">
      다음
    </button>
  </div>
  <div @click="timeout(()=>next($event))" class="viwe" :class="{ 'chag': indfile[1] }" style="position: fixed;background: rgba(0, 0, 0,0.5);width:100%;height:100%;top:0;left:0;">
    <h3 @click="indfile[1]=false" style="position: fixed;right:10%;top:0;transform: translateX(250%);background: rgb(255, 255, 255);padding:1%;border-radius: 10px;">X</h3>
    <div style="text-align: left;margin: 0;word-break: break-all;position: fixed;width:80%;height:80%;background: rgb(200, 255, 200);left:50%;top:5%;transform: translateX(-50%);overflow-y: auto;padding: 20px;border-radius: 10px;">
      <img
        v-if="files[indfile[0]]"
        :src="convertDriveLinkToThumbnail(files[indfile[0]].url)"
        alt="슬라임 이미지"
        @error="handleImageError($event, 'img')"
        style="position: absolute;width: 95%;height: 95%;object-fit: cover;filter: blur(50px);z-index: 0;"
      />
      <img
        v-if="files[indfile[0]]"
        :src="convertDriveLinkToThumbnail(files[indfile[0]].url)"
        alt="슬라임 이미지"
        @error="handleImageError($event, 'img')"
        style="position: relative;width: 100%;height: 100%;object-fit: contain;z-index: 1;"
      />
      <p v-if="files[indfile[0]]" style="font-size:37.5px;margin: 0;border-bottom-style: outset;border-top-style: inset;">{{files[indfile[0]].title}}</p>
      <div style="display: flex; justify-content: center; align-items: center; gap: 10%;margin: 10px 0">
        <button v-if="files[indfile[0]]" :style="{padding: '10px 24px',fontSize: '15px',border: '5px solid '+(likeviwe ===1?'green':'black')}" @click="likebutten(true)">추천({{files[indfile[0]].like}})</button>
        <h1 v-if="files[indfile[0]]">{{files[indfile[0]].like-files[indfile[0]].hate}}</h1>
        <button v-if="files[indfile[0]]" :style="{padding: '10px 24px',fontSize: '15px',border: '5px solid '+(likeviwe ===-1?'red':'black')}" @click="likebutten(false)">비추천</button>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <p @click="goto = `/propil/${discode(otherinfo.userEmail,true)}`" style="font-size: 25px;margin: 0;">
          아티스트: {{ otherinfo.userName }}
        </p>
        <img
          :src="otherinfo.userPicture"
          class="propil"
         @error="handleImageError($event, 'prl')"
         style="object-fit: cover; width: 50px; height: 50px; margin: 0; border-radius: 50%;"
        />
      </div>
      <p v-if="files[indfile[0]]" style="font-size:15px;">{{files[indfile[0]].tags}}</p>
      <p v-if="files[indfile[0]]" style="font-size:15px;">{{new Date(files[indfile[0]].createdAt).toLocaleString()}}</p>
    </div>
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

import HelloWorld from '../components/HelloWorld'
export default {
  name: "jallPage",
  setup() {
    return {};
  },
  data() {
    return {
      likeviwe:0,
      limbtt: 0,
      file: null,
      title: "",
      indfile:[0,false],
      files: [
//         {_id:"68c4cb8183fac5249c2d76a1",
// title:"새 시대",
// email:"original.slime4@gmail.com",
// url:"https://drive.google.com/uc?id=1xtY8Lrzo-Ndf_ZfnfxP6N8g6aX068Ceq",
// like:1,
// hate: 0,
// createdAt:"2025-09-13T01:40:17.081+00:00"},
// {_id:"68c4e2ceae8a37fbee15b656",
// title:"혁명은 바람과도 같지, 늘 내곁에 있으니",
// email:"original.slime4@gmail.com",
// url:"https://drive.google.com/uc?id=1CKC-WTbTwTNXkpH_qYhk13T8UYG8z-rj",
// like:0,
// hate: 1,
// createdAt:"2025-09-13T03:19:42.738+00:00"},
// {_id:"68ca397d92bd9b25c0ef9a49",
// title:"의사양반",
// email:"original.slime4@gmail.com",
// url:"https://drive.google.com/uc?id=1zh2EqHkbyOQNXVjPO4uL8EZtm6KbAJNu",
// like:1,
// hate: 1,
// createdAt:"2025-09-17T04:30:53.802+00:00"}
],
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
      otherinfo:{
        userName: "Unknown",
        userEmail: "abcdefg1234@gmail.com",
        userPicture: "",
        bio: "슬라임의 노예☆입니다",
        followers: 0,
        create:"",
        config:{}
      },
      serchinfo: { searchKeyword: "", currentPage: 1, totalPages: 1 },
    };
  },
  methods: {
    discode(str, encode) {
      if (encode) {
        return btoa(unescape(encodeURIComponent(str)))
      } else {
        return decodeURIComponent(escape(atob(str)))
      }
    },
    timeout(fn){
      var dat
      this.limbtt += 1;
      if (HelloWorld[this.limbtt]) {alert(HelloWorld[this.limbtt]);}
      if (this.limbtt==1){
        dat=fn()
      }
      var last=this.limbtt
      setTimeout(() => {
      if (last==this.limbtt){this.limbtt = 0;}
      }, Math.min(last*250+250,5000));
      console.log(dat)
      return dat
    },
    next(mc){
      if (mc.clientX/window.innerWidth<0.5){
        this.indfile[0]-=1
      }else{
        this.indfile[0]+=1
      }
      this.indfile[0]=Math.max(0,Math.min(this.indfile[0],this.files.length-1))
      this.files[this.indfile[0]].email
      if (this.indfile[1]){this.openui()}
    },
    likebutten(ifd){
      this.timeout(()=>this.like(this.files[this.indfile[0]]._id, ifd, false));
    },
    async openui(){
      this.indfile[1]=true
      this.likeviwe=0
      const dt = await this.like(this.files[this.indfile[0]]._id, true, true)
      console.log(dt)
      if (dt.like){this.likeviwe=1}else
      if (dt.hate){this.likeviwe=-1}
    },
    async analyzeImage(url) {
    try {
      const res = await axios.post("/analyze-image", { url });
      const safe = res.data.safe;
      const labels = res.data.labels;
      if (safe.adult === "LIKELY" || safe.adult === "VERY_LIKELY") {labels.push("선정적")}
      if (safe.violence === "LIKELY" || safe.violence === "VERY_LIKELY") {labels.push("폭력적")}
      if (safe.spoof === "LIKELY" || safe.spoof === "VERY_LIKELY") {labels.push("패러디적")}
      if (safe.medical === "LIKELY" || safe.medical === "VERY_LIKELY") {labels.push("의학적")}
      if (safe.racy === "LIKELY" || safe.racy === "VERY_LIKELY") {labels.push("선정적")}
      return labels;
    } catch (err) {
      if (err.response?.status === 429) {
        alert(err.response.data.error);
      } else {
        alert("분석 실패: " + (err.response?.data?.error || err.message));
      }
      return null;
    }
  },
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
    async checkUploadPermission(email, min) {
      try {
        const res = await axios.get("/jjaltime", {
          params: { email, min },
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
      //tmo
      const canUpload = await this.checkUploadPermission(
        this.userinfo.userEmail,
        30
      );
      if (!canUpload) {
        return;
      }
      const fileUrl = await this.filetourl(); // 먼저 업로드 수행
      if (!fileUrl) return; // 업로드 실패 시 중단
      const sres = await this.analyzeImage(fileUrl);
      if (!sres) return;
      const payload = {
        title: this.title,
        email: this.userinfo.userEmail,
        url: fileUrl,
        tags: sres,
      };
      try {
        await axios.post("/upload-jjal", payload);
        alert("짤 업로드 성공");
        this.timeout(this.getFiles);
      } catch (err) {
        alert("DB 저장 실패: " + (err.response?.data?.error || err.message));
      }
    },
    async getFiles() {
      //tmo
      const res = await axios.get("/jjals", {
        params: {
          page: this.serchinfo.currentPage,
          q: this.serchinfo.searchKeyword,
          safe:this.userinfo.config.viwer||0
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
    prevPage() {
      //tmo
      if (this.serchinfo.currentPage > 1) {
        this.serchinfo.currentPage--;
        this.timeout(this.getFiles());
      }
    },
    nextPage() {
      //tmo
      if (this.serchinfo.currentPage < this.serchinfo.totalPages) {
        this.serchinfo.currentPage++;
        this.timeout(this.getFiles());
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
    this.userinfo.create=res.data.create;
    this.userinfo.followers=res.data.followers;
    this.otherinfo.config=res.data.config;
    console.log("사용자 정보:", this.otherinfo);
  } catch (err) {
    console.error("사용자 정보 가져오기 실패:", err);
    alert("사용자 정보를 불러오지 못했습니다.");
  }
},
async like(id, islike, mod) {
  //tmo
  const payload = { id, islike, mod };
  try {
    const res = await axios.post("/jjallike", payload, { withCredentials: true });
    console.log(res.data)
    if (!mod){
      const gad=res.data;
      if (islike){
      if (!gad || gad.action=="cancel"){this.files[this.indfile[0]].like-=1;this.likeviwe=0}
        else if (gad.action=="switch"){this.files[this.indfile[0]].like+=2;this.likeviwe=1}
        else if (gad.action=="new"){this.files[this.indfile[0]].like+=1;this.likeviwe=1}
      }else{
        if (!gad || gad.action=="cancel"){this.files[this.indfile[0]].like+=1;this.likeviwe=0}
        else if (gad.action=="switch"){this.files[this.indfile[0]].like-=2;this.likeviwe=-1}
        else if (gad.action=="new"){this.files[this.indfile[0]].like-=1;this.likeviwe=-1}
      }
    }
    return res.data; // liked/disliked 상태 또는 success/action
  } catch (err) {
    alert("에러: " + (err.response?.data?.error || err.message));
    return null;
  }
}
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
  max-width: 150px;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
.imagecard{
  background: rgb(200, 200, 200);
  width: 150px;
  max-height: 375px;
  min-height: 150px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.image-grid p {
  margin: 0;
  text-align: left;
  word-break: break-all;
  width: 150px;
}
.viwe{
  transition: opacity 0.1s ease;
  opacity: 0;
  transform: translateX(100%);
}
.viwe.chag{
  opacity: 1;
  transform: translateX(0);
}
</style>//할일 프로필 연령제한
git add .
git commit -m "버그"
git push origin main 
// async updateUserInfo(nickname, bio, picture, config) {
//     try {
//       const res = await axios.put("/user", { nickname, bio, picture, config });
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
