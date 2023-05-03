<script setup lang="ts">
import { getCurrentInstance, provide, onMounted, ref } from "vue";
const { proxy }: any = getCurrentInstance();
import { useMainStore } from "./store/main";
const store = useMainStore();
import MainFooter from "./components/MainFooter.vue";
import { darkTheme } from "naive-ui";
provide: {
  store;
}
if (proxy.$common && proxy.$common.isLogin()) {
  let sender = window.localStorage.getItem("sender");
  if (sender) {
    store.sender = JSON.parse(sender);
  }
  proxy.$router.replace({
    name: "HasChat",
  });
}

const themeActive = ref(false);

const changeTheme = () => {
  if (themeActive.value) {
    document.documentElement.className = "theme-light";
    store.theme = "light";
  } else {
    document.documentElement.className = "theme-default";
    store.theme = "default";
  }
  window.localStorage.setItem("theme", store.theme);
};
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

onMounted(() => {
  let theme = window.localStorage.getItem("theme") || "default";
  themeActive.value = theme == "default" ? false : true;
  changeTheme();
});
</script>

<template>
  <div class="change-theme">
    <n-switch
      v-model:value="themeActive"
      @update:value="changeTheme"
      size="large"
      :rail-style="railStyle"
    >
      <template #checked>
        <i class="iconfont icon-baitian"></i>
      </template>
      <template #unchecked>
        <i class="iconfont icon-heian"></i>
      </template>
    </n-switch>
  </div>
  <n-message-provider>
    <router-view></router-view>
    <main-footer></main-footer>
  </n-message-provider>
</template>

<style>
@import "./assets/icon/iconfont.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}
.change-theme {
  display: flex;
  position: absolute;
  top: 10px;
  left: 30px;
}
</style>
