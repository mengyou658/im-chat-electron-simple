<script setup lang="ts">
import { onMounted, computed, getCurrentInstance } from "vue";
import ChatHead from "./ChatHead.vue";
import ChatFoot from "./ChatFoot.vue";
import { useMainStore } from "../store/main";
const store = useMainStore();
import Conversition from "../class/Conversition";
import { insertHistorySession } from "../api/historySession.js";

const { proxy }: any = getCurrentInstance();

onMounted(() => {
  proxy.$nextTick(() => {
    store.contentScrollbar = proxy.$refs.contentScrollbar;
  });
});

// 获取会话列表
const conversitionList = computed(() => {
  let reciverId = store.reciver?.FormId || store.reciver.Id;
  return store.conversitionList.filter(
    (x: Conversition) =>
      (x.SendId == store.sender.Id && x.ReciverId == reciverId) ||
      (x.ReciverId == store.sender.Id && x.SendId == reciverId)
  );
});

//查看大图
function loadOverImg(img: string) {
  let images = [img];
  proxy.$viewerApi({
    images: images,
  });
}

function insertHistorySessionFun() {
  let data = {
    formId: store.readyReciver.Id,
    name: store.readyReciver.Name,
    nickName: store.readyReciver.NickName || undefined,
    personalitySign: store.readyReciver.PersonalitySign || undefined,
    mobile: store.readyReciver.Mobile || undefined,
    region: store.readyReciver.Region || undefined,
    avatar: store.readyReciver.Avatar,
    email: store.readyReciver.Email,
    byId: store.sender.Id,
  };
  insertHistorySession(data);
}

// 准备发送
function readySend() {
  store.sessionSelectId = store.readyReciver.Id;
  store.reciver = store.readyReciver;
  store.navId = 1;
  store.initEditor();

  let len =
    store.sessionList.filter((x: any) => x.FormId == store.readyReciver.Id)
      ?.length ?? 0;
  if (len === 0) {
    let item = {
      FormId: store.readyReciver.Id,
      Name: store.readyReciver.Name,
      NickName: store.readyReciver.NickName,
      PersonalitySign: store.readyReciver.PersonalitySign,
      Mobile: store.readyReciver.Mobile,
      Region: store.readyReciver.Region,
      Avatar: store.readyReciver.Avatar,
      Email: store.readyReciver.Email,
      ById: store.sender.Id,
    };
    store.sessionList.push(item);
    insertHistorySessionFun();
  }
  store.toBottom();
  store.changeReaded(store.readyReciver.Id);
}

function getRevicerStatus(SendId) {
  let reciverId = store.reciver?.FormId || store.reciver?.Id;
  return SendId == reciverId;
}
</script>

<template>
  <div class="content row-center">
    <div
      v-show="store.navId == 1 && store.sessionSelectId != 0"
      class="content-box"
    >
      <!--头部-->
      <chat-head></chat-head>
      <!--聊天内容-->
      <div class="content-win">
        <n-scrollbar style="max-height: 100%" ref="contentScrollbar">
          <template v-for="(item, index) in conversitionList" :key="index">
            <div v-if="item.SendId == store.sender.Id">
              <div class="mine-block">
                <div v-if="item.State == 0">
                  <n-spin
                    :class="item.Type == 1 ? 'mine-image-load' : 'mine-load'"
                    size="small"
                  />
                </div>
                <div v-else-if="item.State == -1">
                  <span class="item.Type == 1 ? 'sendImageError':'sendError'"
                    >!</span
                  >
                </div>
                <div
                  v-if="item.Type == 0"
                  class="block"
                  v-html="item.Content"
                ></div>
                <img
                  v-else-if="item.Type == 1"
                  class="send-image"
                  v-bind:src="item.Content"
                  @click="loadOverImg(item.Content)"
                  preview="1"
                />
                <video
                  v-else-if="item.Type == 2"
                  class="send-video"
                  width="320"
                  height="240"
                  controls
                >
                  <source :src="item.Content" type="video/mp4" />
                  您的浏览器不支持 HTML5 video 标签。
                </video>
                <audio class="send-video" v-else-if="item.Type == 3" controls>
                  <source :src="item.Content" type="audio/mpeg" />
                  您的浏览器不支持该音频格式。
                </audio>

                <div class="mine-avatar">
                  <img v-bind:src="item.Avatar" />
                </div>
              </div>
              <div style="clear: both"></div>
            </div>
            <div v-else-if="getRevicerStatus(item.SendId)">
              <div v-if="item.State == 1" class="reciver-block">
                <div class="reciver-avatar">
                  <img v-bind:src="item.Avatar" />
                </div>
                <div
                  v-if="item.Type == 0"
                  class="block"
                  v-html="item.Content"
                ></div>
                <img
                  v-else-if="item.Type == 1"
                  class="send-image"
                  v-bind:src="item.Content"
                  @click="loadOverImg(item.Content)"
                  preview="1"
                />
                <video
                  class="send-video"
                  v-else-if="item.Type == 2"
                  width="320"
                  height="240"
                  controls
                >
                  <source :src="item.Content" type="video/mp4" />
                  您的浏览器不支持 HTML5 video 标签。
                </video>
                <audio class="send-video" v-else-if="item.Type == 3" controls>
                  <source :src="item.Content" type="audio/mpeg" />
                  您的浏览器不支持该音频格式。
                </audio>
              </div>
              <div style="clear: both"></div>
            </div>
            <div v-else-if="item.Identity == 3">
              <div class="other-block">
                <span>{{ item.Content }}</span>
              </div>
            </div>
          </template>
        </n-scrollbar>
      </div>
      <!--聊天框底部-->
      <chat-foot></chat-foot>
    </div>
    <div
      v-show="store.navId == 2 && store.allSessionSelectId != 0"
      class="content-box row-center"
    >
      <div class="info-box">
        <n-avatar round :size="80" :src="store.readyReciver.Avatar" />
        <div class="nick-name">{{ store.readyReciver.NickName }}</div>
        <div class="personality-sign">
          {{ store.readyReciver.PersonalitySign }}
        </div>
        <div class="info-more">
          <div class="more-item">
            <span>备&nbsp;&nbsp;&nbsp;&nbsp;注：</span>
            {{ store.readyReciver.Name }}
          </div>
          <div class="more-item">
            <span>手机号：</span>
            {{ store.readyReciver.Mobile }}
          </div>
          <div class="more-item">
            <span>地&nbsp;&nbsp;&nbsp;&nbsp;区：</span>
            {{ store.readyReciver.Region }}
          </div>
        </div>
        <n-button
          class="send-info"
          type="primary"
          size="large"
          @click="readySend"
          :color="store.theme == 'default' ? '#18A058' : '#409EFF'"
          >发消息</n-button
        >
      </div>
    </div>
    <div
      v-show="
        (store.sessionSelectId == 0 && store.navId == 1) ||
        (store.allSessionSelectId == 0 && store.navId == 2)
      "
      class="content-slow"
    >
      <img class="logo" src="/logo.png" />
      <div class="title">闲来没事，聊会天吧~</div>
      <div class="desc">有事没事，记得常联系</div>
    </div>
  </div>
</template>

<style scoped lang="less">
/deep/.emo-image {
  height: 30px;
  width: 30px;
  vertical-align: middle;
  display: inline-block;
}
.content {
  width: 74%;
  height: 100%;
  .content-box {
    height: 95%;
    width: 95%;
    border-radius: 10px;
    background: @boxshow-color9;
    box-shadow: inset 20px 20px 14px @boxshow-color10,
      inset -20px -20px 14px @boxshow-color11;
    overflow: hidden;
    .info-box {
      width: 60%;
      height: 90%;
      color: @primary-txcolor;
      margin: 0 auto;
      .nick-name {
        color: @primary-color;
        font-size: 24px;
        margin-top: 15px;
      }
      .personality-sign {
        color: @primary-txcolor2;
        font-size: 16px;
        margin-top: 15px;
        text-align: left;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 8;
        line-clamp: 8;
        -webkit-box-orient: vertical;
      }
      .info-more {
        margin-top: 20px;
        .more-item {
          padding: 5px 0;
          text-align: left;
          span {
            display: inline-block;
          }
        }
      }
      .send-info {
        margin-top: 50px;
        width: 200px;
      }
    }
    .content-win {
      width: 100%;
      height: 60%;
      .block {
        width: auto;
        height: auto;
        padding: 0px 15px;
        line-height: 30px;
        font-size: 8px;
        border-radius: 10px;
        position: relative;
        max-width: 350px;
        text-align: left;
        word-wrap: break-word;
      }
      .send-video {
        margin: 0 10px;
      }
      .mine-block {
        float: right;
        margin: 20px 0;
        display: flex;
        position: relative;
        .mine-image-load {
          position: absolute;
          left: -50px;
          top: 50%;
          transform: translateY(-50%);
        }
        .mine-load {
          position: absolute;
          left: -50px;
          top: 50%;
          transform: translateY(-50%);
        }
        .send-image {
          border-radius: 11px;
          max-width: 200px;
          overflow: hidden;
          max-height: 200px;
          width: 200px;
          height: auto;
          margin-right: 10px;
          cursor: pointer;
        }

        .block {
          background: @primary-bgcolor4;
          color: @primary-txcolor;
          border-top-right-radius: 0;
          border-bottom-left-radius: 0;
          margin-right: 10px;
          float: right;
          word-wrap: break-word;
        }

        .mine-avatar {
          width: 45px;
          height: 45px;
          float: right;
          margin-right: 15px;
          img {
            height: 100%;
            width: 100%;
          }
        }
      }

      .reciver-block {
        float: left;
        margin: 20px 0;
        display: flex;
        position: relative;
        .send-image {
          border-radius: 11px;
          max-width: 200px;
          overflow: hidden;
          max-height: 200px;
          width: 200px;
          height: auto;
          margin-left: 10px;
          cursor: pointer;
        }
        .reciver-avatar {
          width: 45px;
          height: 45px;
          margin-left: 15px;
          float: left;
          img {
            height: 100%;
            width: 100%;
          }
        }
        .block {
          background: @primary-bgcolor5;
          color: @primary-txcolor3;
          border-top-left-radius: 0;
          border-bottom-right-radius: 0;
          margin-left: 10px;
          float: left;
          word-wrap: break-word;
        }
      }

      .other-block {
        display: flex;
        position: relative;
        padding: 10px;
        background: @primary-bgcolor6;
        color: @primary-txcolor4;
        border-radius: 15px;
        max-width: 400px;
        margin: 0 auto;
        margin-top: 10px;
        margin-bottom: 10px;
        span {
          display: inline-block;
          margin: 0 auto;
        }
      }
    }
  }
  .content-slow:hover {
    /*调用动画*/
    animation-name: slowAnimation;
    /*持续时间*/
    animation-duration: 1s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    cursor: pointer;
  }
  @keyframes slowAnimation {
    0% {
      padding: 0;
    }
    100% {
      border-radius: 30px;
      background: @primary-bgcolor;
      box-shadow: 25px 25px 50px @boxshow-color12,
        -25px -25px 50px @boxshow-color13;
      padding: 20px;
    }
  }
  .content-slow {
    .logo {
      width: 120px;
      height: auto;
    }
    .title {
      font-size: 48px;
      text-align: center;
      color: @primary-txcolor;
    }
    .desc {
      margin-top: 4px;
      font-size: 16px;
      text-align: center;
      color: @primary-txcolor;
    }
    /deep/ .n-result {
      color: @primary-txcolor;
    }
    /deep/ .n-result-header__title {
      color: @primary-txcolor;
    }
    /deep/ .n-button__content {
      color: @primary-txcolor5;
    }
  }
}
</style>
