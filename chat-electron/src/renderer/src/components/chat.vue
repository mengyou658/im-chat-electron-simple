<script setup lang="ts">
import ChatNav from "./ChatNav.vue";
import ChatDomain from "./ChatDomain.vue";
import ChatContent from "./ChatContent.vue";
import { userList } from "../api/user.js";
import { getHistorySessionById } from "../api/historySession.js";
import { getContentBySendId } from "../api/content.js";
import io from "socket.io-client";
import { useMainStore } from "../store/main";
const store = useMainStore();
import Conversition from "../class/Conversition";
import {onMounted, getCurrentInstance, reactive, ref} from "vue";
import Peer from "peerjs";
const { proxy }: any = getCurrentInstance();
import { useMessage } from 'naive-ui'
const messageBox = useMessage();
window.$message = useMessage()
const chatUrl: any = import.meta.env.RENDERER_VITE_BASE_API_WS || "ws://localhost:9527";
const audioDataRef = ref<InstanceType<typeof AudioNode> | null>(null);

const stateData = reactive({
  page: {
    pageIndex: 1,
    pageSize: 30,
  },
  historySessionPage: {
    pageIndex: 1,
    pageSize: 30,
  },
  contentPage: {
    pageIndex: 1,
    pageSize: 30,
  },
  loadUserAll: false,
  loadHistorySessionAll: false,
  loadContentAll: false,
});

const footerStyle = {
  color: 'white',
}

const headerStyle = {
  color: 'white',
}

onMounted(() => {
  init();
});

async function init() {
  if (proxy.$commom.isLogin()) {
    initSocket();
    getUserList();
    getHistorySession();
    getContent();
  } else {
    proxy.$router.replace({
      name: "Home",
    });
  }
}

// 匹配地址栏参数
function GetQueryString(name: string) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

// 获取用户列表
function getUserList() {
  let query = {
    id: store.sender?.Id,
    pageIndex: stateData.page.pageIndex,
    pageSize: stateData.page.pageSize,
  };
  userList(query).then((res: any) => {
    if (res?.code == 200) {
      store.allSessionList.push(...res?.data);
      if (res?.data.length < stateData.page.pageSize) {
        stateData.loadUserAll = true;
      } else {
        stateData.page.pageIndex += 1;
        getUserList();
      }
    } else {
      proxy.$message.error(res?.message);
    }
  });
}

function getHistorySession() {
  let query = {
    id: store.sender?.Id,
    pageIndex: stateData.historySessionPage.pageIndex,
    pageSize: stateData.historySessionPage.pageSize,
  };
  getHistorySessionById(query).then((res: any) => {
    if (res?.code == 200) {
      store.sessionList.push(...res?.data);
      if (res?.data.length < stateData.historySessionPage.pageSize) {
        stateData.loadHistorySessionAll = true;
      } else {
        stateData.historySessionPage.pageIndex += 1;
        getHistorySession();
      }
    } else {
      proxy.$message.error(res?.message);
    }
  });
}

function getContent() {
  let query = {
    id: store.sender?.Id,
    pageIndex: stateData.contentPage.pageIndex,
    pageSize: stateData.contentPage.pageSize,
  };
  getContentBySendId(query).then((res: any) => {
    if (res?.code == 200) {
      store.conversitionList.push(...res?.data);
      if (res?.data.length < stateData.contentPage.pageSize) {
        stateData.loadContentAll = true;
      } else {
        stateData.contentPage.pageIndex += 1;
        getContent();
      }
    } else {
      proxy.$message.error(res?.message);
    }
  });
}

function initSocket() {
  store.socket = io(chatUrl);
  store.socket.on("connect", () => {
    console.log("连接成功");
    store.socket.emit("joinChat", {
      SendId: store.sender.Id,
      SendName: store.sender.Name,
      ReviceId: -1,
      ReviceName: "",
      NoCode: store.noCode,
    });
  });
  store.socket.on("disconnect", () => {
    console.log("连接已断开");
  });
  //修改信息状态
  store.socket.on("changMsgState", (data: any) => {
    store.conversitionList.map((x: Conversition) => {
      if (x.NoCode != null && x.NoCode == data.NoCode) {
        x.State = 1;
      }
    });
  });
  // 加入会话成功
  store.socket.on("joinSuccess", (data: any) => {
    store.sender.OnlineState = true;
    // store.conversitionList = data.conversition;
  });
  //接收信息
  store.socket.on("reviceMsg", (data: Conversition) => {
    if (data.ReciverId == store.sender.Id) {
      store.playMusic();
      if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function (status) {
          var n = new Notification("chatim消息通知", {
            body: "你有一条新的消息",
          });
        });
      }
      for (let item of store.sessionList) {
        let id = item?.FormId || item?.Id;
        if (id == data.SendId && store.sessionSelectId == data.SendId) {
          data.ReadFlag = true;
          let query = {
            SendId: data.SendId,
            ReciverId: store.sender.Id,
          };
          store.socket.emit("changeMsgRead", query);
          break;
        }
      }
    }
    store.sendLocal(data);
    let len =
      store.sessionList.filter((x: any) => {
        let id = x?.FormId || x.Id;
        return id == data.SendId;
      })?.length ?? 0;
    if (len === 0) {
      let item = store.allSessionList.find((x: any) => x.Id == data.SendId);
      let session = {
        FormId: item.Id,
        Name: item.Name,
        NickName: item.NickName,
        PersonalitySign: item.PersonalitySign,
        Mobile: item.Mobile,
        Region: item.Region,
        Avatar: item.Avatar,
        Email: item.Email,
        ById: store.sender.Id,
      };
      store.sessionList.push(session);
    }
    // 展示语音框
    if (data.Type == 4) {
      console.log('conversion data', data.SendId, data.ReciverId, store.reciver.Id, data.Content, data.Type, data.CallState, store.peerInstance.starter)
      if (data.CallState == 0) {
      // 收到语音通话
        store.peerInstance.audioData.show = true
      } else if (data.CallState == 1 && store.peerInstance.instance && store.peerInstance.starter) {
        // 收到同意语音通话
        store.peerInstance.audioData.show = true
        let conn = store.peerInstance.instance.connect('imchatelectronsimple-' + data.SendId);
        conn.on('open', () => {
          console.log('conn opened', data.SendId, data.ReciverId)
        });
        const call = store.peerInstance.instance.call('imchatelectronsimple-' +data.SendId, store.peerInstance.stream);
        console.log('conversion data call start', call)
        call.on("stream", (streamRemote) => {
          // Show stream in some <video> element.
          store.peerInstance.streamRemote = streamRemote;
          store.peerInstance.audioData.stateText = "通话中。。。";
          audioDataRef.value.srcObject = streamRemote
        });
      }

    }

    store.toBottom();
  });
  //多设备在线时，强制旧设备下线
  store.socket.on("squeezeOut", (data: any) => {
    if (data.noCode == store.noCode) {
      store.logout();
      alert("账户在其他地方登陆，会话已断开");
      proxy.$router.replace({
        name: "Home",
      });
    }
  });
}


function stopCallAudio() {
  audioDataRef.value.srcObject = null
  store.stopCallAudio()
}

function startAnswerCallAudio() {
  audioDataRef.value.muted = false
  // TODO
  let self = this
  if (store.peerInstance.instance) {
    messageBox.warning("正在通话中");
    store.peerInstance.audioData.show = true;
    return
  }

  var peerInstance = new Peer('imchatelectronsimple-' +store.sender.Id, {
    host: import.meta.env.RENDERER_VITE_BASE_API_HOST,
    port: import.meta.env.RENDERER_VITE_BASE_API_PORT,
    path: "/peerjs",
  })

  store.peerInstance.instance = peerInstance

  peerInstance.on('open', (id) => {
    console.info('My peer ID is: ' + id);
  });
  peerInstance.on('error', (error) => {
    console.error('peer error', error);
  });

  if (!navigator.mediaDevices) {

  }

  store.sendAudioMsg("语音开始", 4, 1);
  peerInstance.on("call", (call) => {

    navigator.mediaDevices.getUserMedia(
      { video: true, audio: true }).then(
      (stream) => {
        store.peerInstance.stream = stream;
        call.answer(stream); // Answer the call with an A/V stream.

        call.on("stream", (streamRemote) => {
          // Show stream in some <video> element.
          store.peerInstance.streamRemote = streamRemote;
          store.peerInstance.audioData.stateText = "通话中。。。";
          audioDataRef.value.srcObject = streamRemote
        });
      },

    ).catch((err) => {
      console.error("Failed to get local stream", err);
      messageBox.error("发起语音通话失败")
    })
  });
}

</script>

<template>
  <div class="chat">
    <chat-nav />
    <chat-domain />
    <chat-content />
    <n-modal
      v-model:show="store.peerInstance.audioData.show"
      :closable="false"
      :close-on-esc="false"
      :mask-closable="false"
      class="custom-card"
      preset="card"
      style="width: 300px;background-color: #1c1f23;color: white"
      :footer-style="footerStyle"
      :header-style="headerStyle"
      :header-extra-style="headerStyle"
      title="语音聊天"
      size="huge"
      :bordered="false"
      :segmented="{
        content: 'soft',
        footer: 'soft'
      }"
    >
      <template #header>
        <span style="color: white">语音聊天</span>
      </template>
      <template #header-extra>
        <i class="w-e-icon-terminal"></i>
      </template>
      <template #default>
        <div>
          <div >{{store.peerInstance.audioData.stateText}}</div>
          <video controls id="audio-sender" ref="audioDataRef" style="width: 100%;height: 100px;" autoplay></video>
        </div>
      </template>
      <template #action>
        <div>
          <n-button @click="stopCallAudio">挂断</n-button>
          <n-button contr @click="startAnswerCallAudio" v-if="!store.peerInstance.starter && !store.peerInstance.instance">接听</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<style scoped lang="less">
.chat {
  width: 100%;
  height: 100%;
  display: flex;
  border-radius: 33px;
}
</style>
