<template>
  <p style="height: 37.5px;">이 글을 보신당신 베이즈 url에 /slimer 을 붙여라</p>
  
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
  name: "jallPage",
  setup() {
    return {};
  },
  data() {
    return {
      
    };
  },
  methods: {
    

  },
  watch: {
    
  },
  mounted() {
    
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