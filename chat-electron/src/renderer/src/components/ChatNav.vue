<script setup lang="ts">
import { getCurrentInstance, computed } from "vue";
import { useMainStore } from "../store/main";
const store = useMainStore();
import Conversition from "../class/Conversition";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

// 切换菜单栏
function tabClick(id: number) {
  if (store.navId != id) {
    store.navId = id;
  }
}

function logout() {
  store.logout();
  proxy.$router.replace({
    name: "Home",
  });
}

// 获取未读消息数量
const getUnReadCount = computed(() => {
  return (navId: Number) => {
    if (navId != 1) return 0;
    let currentContent = store.conversitionList.filter(
      (x: Conversition) => x.ReciverId == store.sender.Id && !x.ReadFlag
    );
    return currentContent.length > 999 ? "999+" : currentContent.length;
  };
});
</script>

<template>
  <div class="nav">
    <div v-if="store.sender && store.sender.Avatar" class="nav-my row-center">
      <img :src="store.sender.Avatar" class="nav-my-img" />
    </div>
    <ul class="nav-list">
      <template v-for="item in store.navList" :key="item.id">
        <div
          @click="tabClick(item.id)"
          :title="item.name"
          :class="[
            'nav-item',
            'row-center',
            item.id == store.navId ? 'nav-select' : '',
          ]"
        >
          <n-badge :value="getUnReadCount(item.id)">
            <li :class="['iconfont', item.icon]"></li>
          </n-badge>
        </div>
      </template>
    </ul>
    <div class="close">
      <n-tooltip placement="left-start" trigger="hover">
        <template #trigger>
          <span class="iconfont icon-guanji" @click="logout"></span>
        </template>
        有空再聊，再见！
      </n-tooltip>
    </div>
  </div>
</template>

<style scoped lang="less">
.nav {
  height: 100%;
  width: 6%;
  position: relative;
  .close {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .icon-guanji {
      font-size: 40px;
      border-radius: 50%;
      background: #fff;
      cursor: pointer;
    }
  }

  .nav-my {
    height: 20%;
    width: 100%;
    .nav-my-img {
      height: 40px;
      width: 40px;
      border-radius: 50%;
    }
  }
  .nav-list {
    /deep/ .n-badge {
      display: block;
    }
    .nav-item {
      height: 70px;
      line-height: 70px;
      width: 100%;
      cursor: pointer;
    }
    li {
      font-size: 30px;
      color: #fff;
      width: 30px;
      height: 30px;
      line-height: 30px;
    }
    .nav-select {
      background: @primary-bgcolor;
      box-shadow: inset -8px 8px 16px @boxshow-color4,
        inset 8px -8px 16px @boxshow-color5;
    }
  }
}
</style>
