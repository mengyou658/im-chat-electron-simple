<script setup lang="ts">
import { onMounted, getCurrentInstance, watch } from "vue";
import chatim from "../../components/chatim.vue";
import { useMainStore } from "../../store/main";
const store = useMainStore();

// 声音switch样式
const railStyle = ({ focused, checked }: any) => {
  const style = {
    background: "",
    boxShadow: "",
  };
  if (checked) {
    style.background = store.theme == "default" ? "#18A058" : "#409EFF";
    if (focused) {
      style.boxShadow = `0 0 0 2px ${
        store.theme == "default" ? "#18A058" : "#409EFF"
      }`;
    }
  } else {
    style.background = "#888";
    if (focused) {
      style.boxShadow = "0 0 0 2px #888";
    }
  }
  return style;
};

// 监听声音开启
watch(
  () => store.openMusic,
  (newVal, oldVal) => {
    if (newVal) {
      store.tipMusic = document.getElementById("tipMusic");
    }
  }
);
</script>

<template>
  <!--接收信息提示音-->
  <audio id="tipMusic">
    <source src="/mp3/msgTip.mp3" type="audio/mp3" />
  </audio>
  <n-switch
    class="music-btn"
    :rail-style="railStyle"
    v-model:value="store.openMusic"
  >
    <template #checked>不会错过重要提醒啦</template>
    <template #unchecked>开启声音提醒</template>
  </n-switch>
  <div class="main">
    <div class="content">
      <has-chat></has-chat>
    </div>
  </div>
</template>

<style  scoped lang="less">
.music-btn {
  position: absolute;
  right: 30px;
  top: 10px;
}
.main {
  width: 100%;
  min-width: 1200px;
  height: 90%;
  background-color: @primary-bgcolor;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
  .content {
    width: 1200px;
    height: 620px;
    border-radius: 33px;
    background: @primary-bgcolor7;
    box-shadow: 8px 8px 25px @primary-bgcolor7, -8px -8px 25px @boxshow-color3;
    overflow: hidden;
  }
}
</style>
