import {defineStore} from 'pinia'
import User from "../class/User"
import expressions from "../json/expressions.json"
import Conversition from "../class/Conversition"
import E from "wangeditor";
import Peer from "peerjs";
import { util as peerUtil } from "peerjs";

export const useMainStore = defineStore({
  id: 'main',
  state: () => {
    return {
      sender: User,
      reciver: User,
      readyReciver: User,
      navId: 2,
      sessionList: [], //会话列表
      sessionSelectId: 0,
      allSessionList: [],
      allSessionSelectId: 0,
      socket: null,
      noCode: +new Date,
      navList: [
        {id: 1, name: "消息", icon: "icon-message"},
        {id: 2, name: "用户", icon: "icon-merbe"},
      ],
      conversitionList: [],
      expressions: expressions.map(it => {
        it.icon = '.' + it.icon
        return it
      }),
      expressionShow: false,
      contentScrollbar: null,
      chatEditor: null,
      editor: null,
      editorData: '',
      openMusic: false,
      tipMusic: null,
      theme: "default",
      peerInstance: {
        instance: null,
        stream: null,
        streamRemote: null,
        starter: false,
        call: null,
        chatId: null,
        audioData: {
          show: false,
          stateText: '等待接听。。。',
        },
      },
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['sender'] // 持久化数据
      }
    ]
  },
  actions: {
    // 初始化sender
    initSetInfo(data: any) {
      this.sender = data?.myInfo;
      window.localStorage.setItem("token", data?.token);
    },
    // 声音提示
    playMusic() {
      if (this.tipMusic != null && this.openMusic) {
        this.tipMusic.currentTime = 0;
        this.tipMusic.play();
      }
    },
    // 设置会话窗口到达底部
    toBottom() {
      setTimeout(() => {
        this.contentScrollbar.scrollTo({top: 99999});
      }, 100)
    },
    // 修改信息已读状态
    changeReaded(id: number) {
      let userConversition = this.conversitionList.filter(
        (x) =>
          x.SendId == id &&
          x.ReciverId == this.sender.Id &&
          !x.ReadFlag
      );
      if (userConversition.length > 0) {
        for (let i = 0; i < userConversition.length; i++) {
          userConversition[i].ReadFlag = true;
        }
      }
      let query = {
        SendId: id,
        ReciverId: this.sender.Id,
      };
      this.socket.emit("changeMsgRead", query);
    },
    // 初始化编辑器
    initEditor() {
      if (this.editor != null) {
        this.editor.destroy();
        this.editor = null;
      }
      this.editor = new E("#chatEditor");
      this.editor.config.showFullScreen = false;
      this.editor.config.focus = true;

      // 自定义菜单栏
      this.editor.config.menus = [];

      // change
      this.editor.config.onchange = (html) => {
        this.editorData = html;
      };

      // 上传最多1张
      this.editor.config.uploadImgMaxLength = 1;
      // 添加上传本地图片接口
      this.editor.config.customUploadImg = function (
        files,
        insert
      ) {
        insert(files);
      };
      // 聚焦操作
      setTimeout(() => {
        this.editor.create();
        this.editor.txt.html(this.editorData);
      }, 200)
    },
    // 本地新增信息记录
    sendLocal(conversition: Conversition) {
      this.conversitionList.push(conversition);
      this.toBottom();
    },
    // websocket发送消息
    sendInfo(conversition: Conversition) {
      let revicerId = this.reciver?.FormId || this.reciver.Id;
      let data = {
        Conversition: conversition,
        ReciverId: revicerId,
        Sender: this.sender,
      };
      if (this.socket != null) {
        this.socket.emit("sendMsg", data);
      }
    },
    // 注销
    logout() {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("sender");
      if (this.socket != null) {
        this.socket.disconnect();
      }
      if (this.peerInstance.instance) {
        this.stopCallAudio()
      }
      window.location.reload();
    },
    startCallAudio() {
      let self = this
      if (!this.peerInstance || this.peerInstance.instance) {
        window.$message.warning("正在通话中");
        console.log('正在通话中')
        self.peerInstance.audioData.show = true;
        return
      }

      var peerInstance = new Peer('imchatelectronsimple-' +this.sender.Id, {
        host: import.meta.env.RENDERER_VITE_BASE_API_HOST,
        port: import.meta.env.RENDERER_VITE_BASE_API_PORT,
        path: "/peerjs",
      })
      console.log('peerInstance init success')

      this.peerInstance.instance = peerInstance

      peerInstance.on('open', (id) => {
        console.info('My peer ID is: ' + id);
      });
      peerInstance.on('error', (error) => {
        console.error('peer error', error);
      });


      navigator.mediaDevices.getUserMedia(
        {video: false, audio: true}).then(
        (stream) => {
          self.sendAudioMsg("开始发起语音", 4, 0);
          console.log('peerInstance init success')
          self.peerInstance.audioData.show = true;
          self.peerInstance.starter = true;
          self.peerInstance.stream = stream;
          console.log('发起语音')
          // audioDataRef.value.srcObject = stream
          // const call = peerInstance.call(this.reciver.Id, stream);
          // call.on("stream", (remoteStream) => {
          //   // Show stream in some <video> element.
          // });
        }
      ).catch((err) => {
        console.error("Failed to get local stream", err);
        window.$message.error("发起语音通话失败")
        self.peerInstance.instance?.destroy()
        self.peerInstance.stream?.getTracks().forEach(it => it.stop())
        self.peerInstance.instance = null
      })
    },

    sendAudioMsg(content: string, type: number, CallState: number) {
      let noCode = +new Date() + "";
      let reciverId = this.reciver?.FormId || this.reciver.Id;
      let conversition = new Conversition(
        this.sender.Id,
        reciverId,
        content,
        type,
        0,
        noCode,
        "",
        "",
        "",
        "",
        "",
        false,
        this.sender.Avatar
      );
      conversition.CallState = CallState || 0
      if (this.socket == null) {
        window.$message.warning("socket实例为空");
        return;
      }
      this.sendLocal(conversition);
      this.sendInfo(conversition);
    },
    stopCallAudio() {
      // audioDataRef.value.srcObject = null
      this.peerInstance.audioData.show = false;
      this.peerInstance.instance?.destroy()
      this.peerInstance.stream?.getTracks().forEach(it => it.stop())
      this.peerInstance.instance = null
      this.peerInstance = {
        instance: null,
        stream: null,
        streamRemote: null,
        starter: false,
        call: null,
        chatId: null,
        audioData: {
          show: false,
          stateText: '等待接听。。。',
        },
      }
    }

  }
})
