<script setup lang="ts">
import { getCurrentInstance, watch, reactive, onMounted } from "vue";
import { useMainStore } from "../store/main";
const store = useMainStore();
import { useMessage } from "naive-ui";
const messageBox = useMessage();
import Conversition from "../class/Conversition";
defineProps<{
  value: string;
  id: string;
  height: number;
  placeholder: string;
}>();
const { proxy }: any = getCurrentInstance();

const state = reactive({
  editor: {},
  data: "",
  showPopover: false,
});

watch(
  () => proxy.value,
  (newVal, oldVal) => {
    if (proxy.value !== store.editorData) {
      store.editorData = proxy.value;
      if (store.editor && store.editor.txt) {
        store.editor.txt.html(store.editorData);
      }
    }
  },
  {
    immediate: true, // 立即执行
    deep: true, // 深度监听
  }
);
watch(
  () => store.editorData,
  (newVal, oldVal) => {
    proxy.$emit("input", store.editorData);
  }
);

onMounted(() => {
  store.initEditor();
  proxy.$nextTick(() => {
    store.chatEditor = proxy.$refs.chatEditor;
  });
});

function handleChange() {
  let file = proxy.$refs.upload.files[0];
  // var self = this;
  // console.log(file);
}
// 获取文本
function text() {
  try {
    return store.editor.txt.text();
  } catch (e) {
    console.warn(e);
  }
}
// 获取html 有值时为设置内容
function html(value: any) {
  try {
    return store.editor.txt.html(value);
  } catch (e) {
    console.warn(e);
  }
}
function browserType() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isOpera = false;
  if (userAgent.indexOf("Edge") > -1) {
    return "Edge";
  }
  if (userAgent.indexOf(".NET") > -1) {
    return "IE";
  }
  if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    isOpera = true;
    return "Opera";
  } //判断是否Opera浏览器
  if (userAgent.indexOf("Firefox") > -1) {
    return "FF";
  } //判断是否Firefox浏览器
  if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  }
  if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
  } //判断是否Safari浏览器
  if (
    userAgent.indexOf("compatible") > -1 &&
    userAgent.indexOf("MSIE") > -1 &&
    !isOpera
  ) {
    return "IE";
  } //判断是否IE浏览器
}

// 按下回车键
function keyDown(event: any) {
  if (event.ctrlKey && event.keyCode === 13) {
    let len = store.editor.txt.html().trim().length;
    if (browserType() == "IE" || browserType() == "Edge") {
      if (len == 0) {
        store.editor.cmd.do("insertHTML", "<div></div><div></div>");
      } else {
        store.editor.cmd.do("insertHTML", "<div></div>");
      }
    } else if (browserType() == "FF") {
      if (len == 0) {
        store.editor.cmd.do("insertHTML", "<br/><br/><br/><br/>");
      } else {
        store.editor.cmd.do("insertHTML", "<br/><br/>");
      }
    } else {
      if (len == 0) {
        store.editor.cmd.do("insertHTML", "<div><br/></div><div><br/></div>");
      } else {
        store.editor.cmd.do("insertHTML", "<div><br/></div>");
      }
    }
  } else if (event.keyCode === 13) {
    event.preventDefault(); // 阻止浏览器默认换行操作
    sendVerify();
    return false;
  }
}

// 发送校验
function sendVerify() {
  let sendContent = store.editor.txt.html().trim();
  let reciverId = store.reciver?.FormId || store.reciver.Id;

  if (sendContent.length == 0) {
    state.showPopover = true;
    setTimeout(() => {
      state.showPopover = false;
    }, 1000);
    return;
  } else {
    let noCode = +new Date() + "";
    let conversition = new Conversition(
      store.sender.Id,
      reciverId,
      sendContent,
      0,
      0,
      noCode,
      "",
      "",
      "",
      "",
      "",
      false,
      store.sender.Avatar
    );
    if (store.socket == null) {
      messageBox.warning("socket实例为空");
      return;
    }
    store.sendLocal(conversition);
    store.sendInfo(conversition);
  }
  clear();
}

// 聚焦取消表情包显示
function onFous() {
  store.expressionShow = false;
}

// 清空
function clear() {
  try {
    return store.editor.txt.clear();
  } catch (e) {
    console.warn(e);
  }
}
</script>

<template>
  <div class="edit-box">
    <n-scrollbar style="height: 73%">
      <div class="editor">
        <div
          ref="chatEditor"
          :id="id"
          @keydown.enter="keyDown($event)"
          @click="onFous"
        />
        <input
          ref="upload"
          @change="handleChange"
          type="file"
          style="opacity: 0; display: none"
        />
      </div>
    </n-scrollbar>

    <n-tooltip :show="state.showPopover" placement="bottom">
      <template #trigger>
        <n-button
          type="success"
          class="send-btn"
          title="按enter键发送，按ctrl+enter键换行"
          @click="sendVerify"
          :color="store.theme == 'default' ? '#18A058' : '#409EFF'"
          >发送(S)</n-button
        >
      </template>
      <span> 不能发送空白消息 </span>
    </n-tooltip>
  </div>
</template>

<style scoped lang="less">
.edit-box {
  position: relative;
  width: 100%;
  height: 70%;
  border: 1px solid #ccc;

  .editor {
    text-align: left;
  }
  /deep/ .w-e-text-container {
    border: none !important;
    height: 100% !important;
    > div {
      min-height: 135px;
    }
  }
  .send-btn {
    position: absolute;
    bottom: 5px;
    right: 10px;
  }
}
</style>
