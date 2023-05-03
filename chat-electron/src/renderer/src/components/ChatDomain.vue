<script setup lang="ts">
import { computed } from "vue";
import E from "wangeditor";
import Conversition from "../class/Conversition";
import { useMainStore } from "../store/main";
const store = useMainStore();
import User from "../class/User";

// 获取未读消息数量
const getUnReadCount = computed(() => {
  return (id: Number) => {
    return getUnReadCountById(id);
  };
});

// 获取消息最后一条内容
const getLastSession = computed(() => {
  return (id: Number) => {
    let currentContent: Array<Conversition> = store.conversitionList.filter(
      (x: Conversition) =>
        (x.SendId == store.sender.Id && x.ReciverId == id) ||
        (x.SendId == id && x.ReciverId == store.sender.Id)
    );
    let result = "";
    if (currentContent.length > 0) {
      let len = currentContent.length - 1;
      switch (currentContent[len].Type) {
        case 0:
          result = currentContent[len].Content;
          break;
        case 1:
          result = "图片";
          break;
        case 2:
          result = "视频";
          break;
        case 3:
          result = "语音";
          break;
      }
    }
    return result;
  };
});

//根据Id获取未读消息数量
function getUnReadCountById(id: Number) {
  let currentContent = store.conversitionList.filter(
    (x: Conversition) =>
      x.SendId == id && x.ReciverId == store.sender.Id && !x.ReadFlag
  );
  return currentContent.length > 999 ? "999+" : currentContent.length;
}

// 选择会话用户
function selectSession(item: User) {
  if (store.navId == 1) {
    store.sessionSelectId = item.FormId;
    store.reciver = item;
    store.toBottom();
    store.changeReaded(item.FormId);
    store.initEditor();
  } else if (store.navId == 2) {
    store.allSessionSelectId = item.FormId || item.Id;
    store.readyReciver = item;
  }
}
</script>

<template>
  <div class="domain">
    <n-scrollbar style="max-height: 100%">
      <div v-show="store.navId == 1">
        <template v-if="store.sessionList && store.sessionList.length > 0">
          <div
            :class="[
              'session-item',
              item.FormId == store.sessionSelectId ? 'session-active' : '',
            ]"
            v-for="item in store.sessionList"
            :key="item.Id"
            @click="selectSession(item)"
          >
            <div class="session-img">
              <!-- <img :src="item.Avatar" /> -->
              <n-badge :value="getUnReadCount(item.FormId)">
                <n-avatar size="medium" :src="item.Avatar"></n-avatar>
              </n-badge>
            </div>
            <div class="session-content">
              <div class="session-name text-ellipsis">{{ item.Name }}</div>
              <div
                class="session-desc text-ellipsis"
                v-html="getLastSession(item.FormId)"
              ></div>
            </div>
          </div>
        </template>
        <div class="empty-session" v-else>
          <img class="empty-img" src="../assets/img/empty.png" alt="" />
          <div class="empty-text">暂无会话</div>
        </div>
      </div>
      <div
        v-show="store.navId == 2"
        :class="[
          'session-item',
          item.Id == store.allSessionSelectId ? 'session-active' : '',
        ]"
        v-for="item in store.allSessionList"
        :key="item.FormId"
        @click="selectSession(item)"
      >
        <div class="session-img">
          <!-- <img :src="item.Avatar" /> -->
          <n-avatar size="medium" :src="item.Avatar"></n-avatar>
        </div>
        <div class="session-content">
          <div class="session-name text-ellipsis">{{ item.Name }}</div>
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>

<style scoped lang="less">
.domain {
  height: 100%;
  width: 20%;
  background: @primary-bgcolor;
  box-shadow: inset 19px 19px 38px @boxshow-color4,
    inset -19px -19px 38px @boxshow-color5;
  padding: 6px 8px;

  .empty-session {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .empty-img {
      width: 200px;
      height: auto;
    }
    .empty-text {
      color: #fff;
      margin-top: 20px;
    }
  }

  .session-item {
    height: 70px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 20px;
    cursor: pointer;
    &:hover {
      border-radius: 50px;
      background: @boxshow-color6;
      box-shadow: inset 12px 12px 24px @boxshow-color6,
        inset -12px -12px 24px @boxshow-color6;
    }
    .session-img {
      width: 30%;
      img {
        height: 40px;
        width: 40px;
        border-radius: 50%;
      }
    }
    .session-content {
      width: 60%;
      margin-left: 10%;
      text-align: left;
      .session-name {
        color: @primary-txcolor;
        font-size: 16px;
      }
      .session-desc {
        font-size: 12px;
        margin-top: 6px;
        color: @input-border-txcolor;
        display: flex;
        height: 20px;

        /deep/ * {
          padding: 0;
          margin: 0;
        }
        /deep/ img {
          height: 20px !important;
          width: 20px !important;
        }
      }
    }
  }
  .session-active {
    border-radius: 50px;
    background: @boxshow-color4;
    box-shadow: inset 12px 12px 24px @boxshow-color8,
      inset -12px -12px 24px @boxshow-color7;
  }
}
</style>
