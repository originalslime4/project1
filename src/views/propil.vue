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
    <div style="display: flex; align-items: center; gap: 10px;flex-wrap: wrap;border-color: rgb(200,200,200);border-bottom-style: outset;border-top-style: inset;padding:5px;">
    <span>{{otherinfo.config.showemail?otherinfo.userEmail:"이메일 비공개"}}ㆍ</span>
    <span>{{otherinfo.config.showfollow?"팔로잉 비공개":otherinfo.followers+"명"}}</span>
    </div>
    <span>{{ otherinfo.bio }}</span>
    <button style="padding: 10px 24px;font-size: 15px;" @click="mainbutton">{{otherinfo.userEmail === userinfo.userEmail?"프로필 설정":(following.find(item => item.following === otherinfo.userEmail)?"팔로우중":"팔로우")}}</button>
  </div>
    </div>
    <div class="viwe" :class="{ 'chag': sett }" style="position: fixed;background: rgba(0, 0, 0,0.5);width:100%;height:100%;top:0;left:0;">
    <div style="text-align: left;margin: 0;word-break: break-all;position: fixed;width:80%;height:80%;background: rgb(200, 255, 200);left:50%;top:5%;transform: translateX(-50%);overflow-y: auto;padding: 20px;border-radius: 10px;">
    <div style="display: flex; align-items: center; gap: 10px;flex-wrap: wrap;border-color: #000000;border-bottom-style: outset;border-top-style: inset;padding:10px;">
      <img
        :src="otherinfo.userPicture"
        class="propil"
        @error="handleImageError($event, 'prl')"
        style="object-fit: cover; width: 150px; height: 150px; margin: 0; border-radius: 50%;"
      />
      <input type="file" @change="onFileChange" accept="image/*,video/gif" />
      <button style="font-Size:25px;" @click="uploadFile">이미지 변경</button>
      <input style="width:100%;height:25px;" v-model="saveinfo.bio" placeholder="설명(100자)" maxlength="100"/>
      </div>
    <div style="display: flex; align-items: center; gap: 10px;flex-wrap: wrap;border-color: #000000;border-bottom-style: outset;border-top-style: inset;padding:10px;">
  <p style="width:100%;margin: 0;">|기본설정|</p>
  <input type="checkbox" v-model="saveinfo.config.showemail" />:자신의 이메일 보여주기<div style="width:100%;margin: 0;"></div>
  <input type="checkbox" v-model="saveinfo.config.showfollow" />:팔로잉및 생성일자 비공개<div style="width:100%;margin: 0;"></div>
  <input type="checkbox" v-model="saveinfo.config.showfollow" />:자신의 전생여부 비공개<div style="width:100%;margin: 0;"></div>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;flex-wrap: wrap;border-color: #000000;border-bottom-style: outset;border-top-style: inset;padding:10px;">
  <p style="width:100%;margin: 0;">|접근성|</p>
  <select v-model="saveinfo.config.role">
    <option value="mdl">모델러</option>
    <option value="sct">스크립터</option>
    <option value="art">아티스터</option>
    <option value="ytb">유튜버</option>
    <option value="fan">선풍기&#40;Fan&#41;</option>
    <option value="per">기타 어른이</option>
    <option value="nob">백수</option>
  </select>:개인역할<div style="width:100%;margin: 0;"></div>
  <select v-model="saveinfo.config.gender">
    <option value="n">밝히지않음</option>
    <option value="m">남자</option>
    <option value="f">여자</option>
    <option value="na">모르겠음</option>
    <option value="fa">남장 여</option>
    <option value="ma">여장 남</option>
    <option value="mb">남장 남</option>
    <option value="fb">여장 여</option>
    <option value="nb">정의하지 않음</option>
    <option value="nc">바뀔수 있음</option>
    <option value="mc">YY염색체</option>
    <option value="fc">남자가 될것 같음</option>
    <option value="md">여자가 될것 같음</option>
    <option value="me">고자가 될것 같음</option>
    <option value="nd">고자</option>
    <option value="ne">중성</option>
    <option value="mf">남자라고 믿고 있음</option>
    <option value="fd">여자라고 믿고 있음</option>
    <option value="nf">또다른 하나임</option>
    <option value="fe">보추</option>
    <option value="ng">존재하지 않음</option>
    <option value="nh">다중 영혼</option>
    <option value="ni">게임오브젝트임</option>
    <option value="nj">음식임</option>
    <option value="ff">김묘령</option>
  </select>:성별<div style="width:100%;margin: 0;"></div>
  <select v-model="saveinfo.config.type">
    <option value="a">인간</option>
    <option value="b">수인</option>
    <option value="c">퍼리</option>
    <option value="d">고블린</option>
    <option value="e">엘프</option>
    <option value="f">용인족</option>
    <option value="g">다크엘프</option>
    <option value="h">호모슬라임</option>
    <option value="i">혈귀</option>
    <option value="j">마족</option>
    <option value="k">오크</option>
    <option value="l">용인족</option>
    <option value="m">전생동물</option>
    <option value="n">영혼인형</option>
    <option value="o">보스몬스터</option>
    <option value="p">해골</option>
    <option value="q">외계인</option>
  </select>:종족<div style="width:100%;margin: 0;"></div>
      </div>
    <div style="display: flex; align-items: center; gap: 10px;flex-wrap: wrap;border-color: #000000;border-bottom-style: outset;border-top-style: inset;padding:10px;">
  <p style="width:100%;margin: 0;">|민감성|</p>
  <input type="radio" v-model="saveinfo.config.viwer" value=-1>:모두검열<div style="width:100%;margin: 0;"></div>
<input type="radio" v-model="saveinfo.config.viwer" value=0>:일부검열<div style="width:100%;margin: 0;"></div>
<input type="radio" v-model="saveinfo.config.viwer" value=1>:거의헤제<div style="width:100%;margin: 0;"></div>
<input type="radio" v-model="saveinfo.config.viwer" value=2>:전부헤제<div style="width:100%;margin: 0;"></div>
      </div>
      <p></p>
      <button style="font-size:25px;" @click="updateUserInfo">저장하기</button>
    <!-- <img style="width:25px;height:25px;" scr="{{file}}" @error="handleImageError($event, 'img')" /> -->
    
    
    <!-- <p style="font-size:37.5px;margin: 0;border-bottom-style: outset;border-top-style: inset;">{{files[indfile[0]].title}}</p>
    <div style="display: flex; justify-content: center; align-items: center; gap: 10%;margin: 10px 0">
      <button :style="{padding: '10px 24px',fontSize: '15px',border: '5px solid '+(likeviwe ===1?'green':'black')}" @click="like(files[indfile[0]]._id, true, false);likeviwe=(likeviwe==1)?0:1;">추천({{ files[indfile[0]].like + likeviwe }})</button>
      <h1>{{files[indfile[0]].like-files[indfile[0]].hate+likeviwe}}</h1>
      <button :style="{padding: '10px 24px',fontSize: '15px',border: '5px solid '+(likeviwe ===-1?'red':'black')}" @click="like(files[indfile[0]]._id, false, false);likeviwe=(likeviwe==-1)?0:-1;;">비추천</button>
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
    <p style="font-size:15px;">{{files[indfile[0]].tags}}</p>
    <p style="font-size:15px;">{{new Date(files[indfile[0]].createdAt).toLocaleString()}}</p> -->
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
//import { config } from 'googleapis/build/src/apis/config';
export default {
  name: "propilPage",
  setup() {
    return {};
  },
  data() {
    return {
      coded: this.discode(this.$route.params.userid,false),
      file: null,
      limbtt: 0,
      sett:false,
      saveinfo:{
        userName: "Unknown",
        userPicture: "",
        bio: "슬라임의 노예☆입니다",
        config:{}
      },
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
      following: [],
    }
  },
  methods: {
    // butten(){
    //   if (otherinfo.userEmail==userinfo.userEmail){
    //     return "프로필 설정"
    //   }else if (this.following.find(item => item.following === "x")){

    //   }
    // },
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
        onFileChange(e) {
      this.file = e.target.files[0];
    },
    async mainbutton(){
      if (this.userinfo.userEmail==this.otherinfo.userEmail){
        this.sett=this.sett?false:true
      }else if(this.following.find(item => item.following === this.otherinfo.userEmail)){
        this.unfollowUser(this.otherinfo.userEmail)
      }else{
        this.followUser(this.otherinfo.userEmail)
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
      this.limbtt += 1;
      if (HelloWorld[this.limbtt]) {alert(HelloWorld[this.limbtt]);}
      if (this.limbtt==1){
      const fileUrl = await this.filetourl();
      if (!fileUrl) return;
      this.saveinfo.userPicture=fileUrl
      }
      var last=this.limbtt
      setTimeout(() => {
      if (last==this.limbtt){this.limbtt = 0;}
      }, Math.min(last*250+250,5000));
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
async getFollowData() {
      try {
        const res = await axios.get("/following");
        this.following = res.data;
      } catch (err) {
        console.error("팔로우 정보 조회 실패:", err);
        this.following = [];
      }
    },
    async followUser(targetEmail) {
    try {
      const res = await axios.post(`/follow/${targetEmail}`);
      return res.data.success;
    } catch (err) {
      console.error("팔로우 실패:", err);
      return false;
    }
  },
async unfollowUser(targetEmail) {
    try {
      const res = await axios.delete(`/follow/${targetEmail}`);
      return res.data.success;
    } catch (err) {
      console.error("언팔로우 실패:", err);
      return false;
    }
  },
  async updateUserInfo() {
    try {
      const res = await axios.put("/user", { nickname:this.saveinfo.userName, bio:this.saveinfo.bio, picture:this.saveinfo.picture, config:this.saveinfo.config });
      this.sett=false;
      return res.data.success;
    } catch (err) {
      console.error("사용자 정보 수정 실패:", err);
      return false;
    }
  },
  },
  mounted() {
    this.coded= this.discode(this.$route.params.userid,false)
      this.getuse(this.coded)
      this.checkLogin();
      this.getFollowData();
  },
  watch: {
    '$route.params.userid'(newId, oldId) {
      console.log("userid 변경:", oldId, "→", newId)
      this.coded= this.discode(this.$route.params.userid,false)
      this.getuse(this.coded)
      this.checkLogin();
      this.getFollowData();
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
.viwe{
  transition: opacity 0.1s ease;
  opacity: 0;
  transform: translateX(100%);
}
.viwe.chag{
  opacity: 1;
  transform: translateX(0);
}
</style>