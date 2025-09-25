<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      만약 문의사항이 있다면 저희 디스코드로 오십시오, 심심합니다 여러분의 대화가 필효합니다.
      <a href="https://discord.gg/CB9ESjfQub" target="_blank" rel="noopener">디스코드-Blockworld</a>.
    </p>
    <h3>유튜브</h3>
    <ul>
      <li><a href="https://www.youtube.com/@Slcripter" target="_blank" rel="noopener">슬마임 -폐쇠됨-</a></li>
      <li><a href="https://www.youtube.com/@KmSlime" target="_blank" rel="noopener">KM슬라임 -현재 운영중-</a></li>
    </ul>
    <h3>카카오톡</h3>
    <ul>
      <li><a href="https://open.kakao.com/o/gve6MTTh" target="_blank" rel="noopener">카르마 슬라임</a></li>
    </ul>
    <h3>도움을 준 사람들</h3>
    <ul>
      <li><a href="" target="_blank" rel="noopener">kms1537 -킴스-</a></li>
      <li><a href="" target="_blank" rel="noopener">melo_tini -멜로빅-</a></li>
      <li><a target="_blank" rel="noopener">빛 -빛-</a></li>
      <li><a href="" target="_blank" rel="noopener">cloudclouds727 -김묘령-</a></li>
      <li><a href="" target="_blank" rel="noopener">그외 기타등등</a></li>
    </ul>
    <h3>평범한 제작자 세부정보</h3>
    <ul>
      <li><b target="_blank" rel="noopener">전번|+82 010-3110-5872</b></li>
      <li><b target="_blank" rel="noopener">이메일|않받음</b></li>
      <li><b target="_blank" rel="noopener">지역|대한민국 경남 창원시 성산구 반림동 노블파크</b></li>
      <li><b target="_blank" rel="noopener">평제|한재민_090116 종족:호모슬라임 성별:치킨샌드위치</b></li>
      <li><b target="_blank" rel="noopener">이세계에서 현실로 누군가에게 소환당함</b></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 25px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: rgb(0, 150, 0);
}
</style>
