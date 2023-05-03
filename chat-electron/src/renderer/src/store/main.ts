import { defineStore } from 'pinia'
import User from "../class/User"
import expressions from "../json/expressions.json"
import Conversition from "../class/Conversition"
import E from "wangeditor";

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
        { id: 1, name: "消息", icon: "icon-message" },
        { id: 2, name: "用户", icon: "icon-merbe" },
      ],
      conversitionList: [],
      expressions: expressions,
      expressionShow: false,
      contentScrollbar: null,
      chatEditor: null,
      editor: null,
      editorData: '',
      openMusic: false,
      tipMusic: null,
      theme: "default",
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
        this.contentScrollbar.scrollTo({ top: 99999 });
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
      window.location.reload();
    },
  }
})