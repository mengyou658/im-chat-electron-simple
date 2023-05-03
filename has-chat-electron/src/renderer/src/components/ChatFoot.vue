<script setup lang="ts">
import ChatEditor from "@/components/ChatEditor.vue";
import Conversition from "@/class/Conversition";
import { ref, getCurrentInstance } from "vue";
const { proxy }: any = getCurrentInstance();
import { useMainStore } from "../store/main";
const store = useMainStore();
import { useMessage } from "naive-ui";
const messageBox = useMessage();
import { uploadFile } from "@/api/common";

const editor = ref(null);

// 切换表情包
function changeExpression() {
  store.expressionShow = !store.expressionShow;
}

// 选择表情
function selectIcon(icon: string) {
  changeExpression();
  let iconContent = `<img src='${icon}' class='emo-image' />`;
  store.editor.cmd.do("insertHTML", iconContent);
}

function blurHighLight(data: string) {
  // 这里做数据过滤或样式变更操作
  store.sendInfo = data;
}

//发送图片
function sendImage(e: any) {
  const fileObj = e.target.files[0];

  if (fileObj != null) {
    if (!/image\/\w+/.test(fileObj.type)) {
      return alert("请选择图片文件!");
    }
    var fd = new FormData();
    fd.append("file", fileObj);
    if (fileObj.size > 1024 * 1024 * 10) {
      return alert("上传图片不能超过10M!");
    } else {
      let reader = new FileReader();
      reader.readAsDataURL(fileObj);
      reader.onload = (event: any) => {
        sendVerify(event.target.result, 1);
        proxy.$refs.referenceUpload.value = null;
      };
    }
  }
}

//发送视频
async function sendVideo(e: any) {
  const resultFile = e.target.files;
  const fileObj = new Blob([resultFile[0]], { type: "video/mp4" });
  const tempFilePath = URL.createObjectURL(fileObj);
  let noCode = +new Date() + "";
  let conversition = new Conversition(
    store.sender.Id,
    store.reciver.Id,
    tempFilePath,
    2,
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
  store.sendLocal(conversition);
  let result: any = await uploadFileFun(e.target.files[0]);
  if (result.code == 200) {
    conversition.Content = result.content;
    store.sendInfo(conversition);
  }
  proxy.$refs.referenceUploadVideo.value = null;
}

//上传文件资源
function uploadFileFun(tempFilePath: string) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", tempFilePath);
    let result = {
      code: 500,
      content: "",
    };
    uploadFile(formData)
      .then((res: any) => {
        if (res?.length > 0) {
          result.code = 200;
          result.content =
            "http://localhost:9527" +
            `/api/getFile?url=${res[0].filename}${res[0].originalname}`;
          resolve(result);
        } else {
          resolve(result);
        }
      })
      .catch((err) => {
        resolve(result);
      });
  });
}

// 发送校验
function sendVerify(content: string, type: number) {
  let noCode = +new Date() + "";
  let reciverId = store.reciver?.FormId || store.reciver.Id;
  let conversition = new Conversition(
    store.sender.Id,
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
    store.sender.Avatar
  );
  if (store.socket == null) {
    messageBox.warning("socket实例为空");
    return;
  }
  store.sendLocal(conversition);
  store.sendInfo(conversition);
}
</script>

<template>
  <footer class="footer">
    <!--工具栏-->
    <div class="foot-top">
      <ul>
        <li @click="changeExpression()" class="iconfont icon-biaoqing"></li>
        <li class="iconfont icon-tupian" @click="store.expressionShow = false">
          <input
            ref="referenceUpload"
            class="file-image"
            name="customerService"
            type="file"
            value=""
            accept="image/*"
            v-on:change="sendImage"
          />
        </li>
        <li class="iconfont icon-shipin" @click="store.expressionShow = false">
          <input
            ref="referenceUploadVideo"
            class="file-image"
            name="customerService"
            type="file"
            value=""
            accept="video/*"
            v-on:change="sendVideo"
          />
        </li>
      </ul>
    </div>
    <!--表情包-->
    <div v-show="store.expressionShow" class="emjon">
      <n-scrollbar style="max-height: 100%">
        <ul>
          <li
            v-for="item in store.expressions"
            :key="item.title"
            :title="item.title"
          >
            <img :src="item.icon" @click="selectIcon(item.icon)" />
          </li>
        </ul>
      </n-scrollbar>
    </div>
    <chat-editor
      v-model="store.sendInfo"
      ref="editor"
      id="chatEditor"
      :height="135"
      class="answer-editor"
      placeholder=" "
    ></chat-editor>
  </footer>
</template>

<style scoped lang="less">
.footer {
  height: 35%;
  padding: 0 20px;
  width: 100%;
  background-color: #fff;
  position: relative;
  .foot-top {
    width: 100%;
    height: 25%;
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: -webkit-box;
      -webkit-box-orient: horizontal;
    }
    li {
      margin: 5px 10px;
      font-size: 25px !important;
      position: relative;
    }
    .file-image {
      margin-top: 5px;
      z-index: 1;
      position: absolute;
      opacity: 0;
      bottom: 0px;
      left: 0px;
      height: 40px;
      width: 25px;
    }
  }
  .emjon {
    width: 350px;
    height: 245px;
    position: absolute;
    left: 30px;
    top: -262px;
    background: #fff;
    // box-shadow: 2px 2px 4px #888888;
    overflow: auto;
    border-top-left-radius: 14px;
    border-bottom-right-radius: 14px;
    ul {
      padding: 10px;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 55px;
        font-size: 28px !important;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease 0s;
      }
      li:hover {
        // box-shadow: 0px 0px 5px #ccc;
        transform: scale(1.2);
      }
      img {
        width: 30px;
        height: 30px;
      }
    }
  }
}
</style>
