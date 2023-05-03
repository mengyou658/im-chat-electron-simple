<script setup lang="ts">
function toDetail(url: string) {
  window.open(url);
}
</script>

<template>
  <div class="footer-box">
<!--    <div class="footer">
      <ul>
        <li
          class="text"
          @click="toDetail('https://gitee.com/howcode/has-chat')"
        >
          Gitee
        </li>
        <li class="line"></li>
        <li class="text" @click="toDetail('https://howcode.online')">
          howcode
        </li>
      </ul>
    </div>
    <p @click="toDetail('https://beian.miit.gov.cn/')">粤ICP备2021160789号</p>-->
  </div>
</template>

<style scoped lang="less">
.footer-box {
  min-width: 1200px;
  width: 100%;
  height: 10%;
  background-color: @primary-bgcolor7;
  background-repeat: no-repeat;
  overflow: hidden;
  padding-top: 10px;

  .footer {
    width: 1200px;
    margin: auto;
    display: flex;
    justify-content: center;
    color: @primary-txcolor;
  }
  ul {
    display: flex;
    justify-content: center;
    align-items: center;

    .text {
      font-size: 16px;
      color: @primary-txcolor;
      font-weight: bold;
      cursor: pointer;
    }

    .line {
      width: 2px;
      height: 15px;
      margin-left: 20px;
      margin-right: 20px;
      background: @primary-txcolor;
    }
  }
  p {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: @primary-txcolor;
    margin: 0;
    cursor: pointer;

    &:not(:last-of-type) {
      margin-right: 5px;
    }
  }
}
</style>
