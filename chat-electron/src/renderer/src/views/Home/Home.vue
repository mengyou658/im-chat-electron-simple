<script setup lang="ts">
import { reactive, getCurrentInstance, onMounted } from "vue";
const { proxy }: any = getCurrentInstance();
import {
  login,
  register,
  sendVerificationCode,
  getRandomUser,
  checkVerificationCode,
} from "../../api/user.js";
import axios from "axios";
import { useMessage } from "naive-ui";
const messageBox = useMessage();
window.$message = useMessage()
import { useMainStore } from "../../store/main";
const store = useMainStore();
import { InitData } from "./js/home";
onMounted(() => {
  // 聚焦文库
  proxy.$refs.userCode.focus();
  setTimeout(() => {
    data.showPopover = true;
  }, 4000);
  data.gifIndex = randomNum(1, 9);
});

let data = reactive(new InitData());
data.showModal = false
// 回车登陆
document.onkeydown = function (ev: any) {
  let Event: any = ev || event;
  if (Event.keyCode == 13) {
    toLogin();
  }
};

// 登陆
function toLogin() {
  if (!(data.form.email && data.form.password)) {
    messageBox.warning("账号或密码不能为空");
    return;
  }
  login(data.form).then((res: any) => {
    if (res?.code == 200) {
      store.initSetInfo(res?.data);
      proxy.$router.replace({
        name: "Main",
      });
    } else {
      if (messageBox != undefined) {
        messageBox.error(res?.message);
      }
    }
  });
}

// 注册
function toRegister() {
  if (!data.registerForm.name) {
    messageBox.warning("用户名不能为空");
    return;
  }
  if (!data.registerForm.password) {
    messageBox.warning("密码不能为空");
    return;
  }
  if (data.registerForm.password !== data.registerForm.surePassword) {
    messageBox.warning("两次密码不一致");
    return;
  }
  register(data.registerForm).then((res: any) => {
    if (res?.code == 200) {
      messageBox.success(res?.message);
      data.showModal = false;
      initChangeStage(1);
    } else {
      messageBox.error(res?.message);
    }
  });
}

// 初始化切换状态
function initChangeStage(state: number) {
  data.isLogin = state;
  data.step = 1;
  data.verificationCode = "";
  data.sendVerificationCodeState = false;
  data.hasSendVerificationCode = false;
  data.registerForm.email = "";
  data.registerForm.name = "";
  data.registerForm.password = "";
  data.registerForm.surePassword = "";
  data.form.email = "";
  data.form.password = "";
  data.countdown = 60;
  data.timer = null;
}

// 打开注册面板
async function openModel() {
  try {
    if (data.registerForm.email.indexOf("@qq.com") == -1) {
      messageBox.warning("请输入正确的QQ邮箱");
      return;
    }
    let opt: any = data.registerForm.email.split("@");
    if (opt.length != 2) {
      messageBox.warning("请输入正确的QQ邮箱");
      return;
    }

    let res: any = await getQQUserInfo(opt[0]);
    data.registerForm.name = res.name;
    data.registerForm.avatar = res.imgurl;
    data.showModal = true;
  } catch (err: any) {
    messageBox.error(err);
  }
}

function getQQUserInfo(qq: string) {
  return new Promise((resolve, reject) => {
    data.loading = true;
    axios({
      method: "get", // 请求方式
      url: "https://tenapi.cn/qqname/?qq=" + qq,
    })
      .then((res: any) => {
        if (res?.data?.code == 200) {
          resolve(res.data);
        } else {
          let msg = res.data.msg || "查询的QQ号不存在";
          reject(msg);
        }
      })
      .finally(() => {
        data.loading = false;
      });
  });
}

// 随机获取用户
function getRandom() {
  getRandomUser().then((res: any) => {
    if (res?.code == 200) {
      data.form.email = res?.data?.Email;
      data.form.password = res?.data?.Password;
    } else {
      messageBox.error(res?.message);
    }
  });
}

// 切换登陆注册
function tiggerSelect() {
  data.showModal = true;
  initChangeStage(1);
  proxy.$nextTick(() => {
    proxy.$refs.userCode.focus();
  });
}

// 发送邮箱验证码
function toSendVerificationCode() {
  if (!data.registerForm.email) {
    messageBox.warning("邮箱不能为空");
    return;
  }
  let query = {
    email: data.registerForm.email,
    timestamp: data.timestamp,
  };
  sendVerificationCode(query).then((res: any) => {
    if (res?.code == 200) {
      messageBox.success(res?.message);
      data.sendVerificationCodeState = true;
      data.hasSendVerificationCode = true;
      data.timer = setInterval(() => {
        if (data.countdown < 1) {
          if (data.timer != null) {
            clearInterval(data.timer);
            data.timer = null;
          }
          data.countdown = 60;
        } else {
          data.countdown--;
        }
      }, 1000);
    } else {
      messageBox.error(res?.message);
    }
  });
}
function randomNum(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 校验邮箱验证码
function toCheckVerificationCode() {
  let query = {
    verificationCode: data.verificationCode,
    timestamp: data.timestamp,
  };
  checkVerificationCode(query).then((res: any) => {
    if (res?.code == 200) {
      if (data.timer != null && data.timer != undefined) {
        clearInterval(data.timer);
        data.timer = null;
      }
      data.step = 2;
      data.countdown = 60;
      data.sendVerificationCodeState = false;
      proxy.$nextTick(() => {
        proxy.$refs.passwordInput.focus();
      });
    } else {
      messageBox.error(res?.message);
    }
  });
}
</script>

<template>
  <div class="main">
    <main class="sign-main">
      <div class="image-box">
        <img :src="'./gif/5.jpg'" alt="" />
        <!-- <img src="../../assets/gif/1.gif" alt="" /> -->
      </div>
      <div class="sign-box">
          <div class="form-group">
            <input
              type="text"
              class="form-control form-control-lg"
              placeholder="邮箱账户"
              v-model="data.form.email"
              ref="userCode"
            />
          </div>
          <div class="form-group">
            <input
              type="password"
              class="form-control form-control-lg"
              placeholder="用户密码"
              v-model="data.form.password"
            />
          </div>
          <n-button
            class="login-btn"
            :color="store.theme == 'default' ? '#161A21' : '#409EFF'"
            @click="toLogin"
            >登录</n-button
          >
        <div class="sign-bottom">
          <div @click="tiggerSelect">立即注册</div>
        </div>
      </div>
    </main>
    <n-modal v-model:show="data.showModal">
      <div class="tip-content" style="height: 530px">
        <div class="popup-header">
          <span class="iconfont icon-dunpai"></span>
        </div>
        <div class="form-group">
          <input
            type="text"
            class="form-control form-control-lg"
            placeholder="用户姓名"
            v-model="data.registerForm.name"
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            class="form-control form-control-lg"
            placeholder="邮箱"
            v-model="data.registerForm.email"
            ref="emailInput"
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            class="form-control form-control-lg"
            placeholder="密码"
            v-model="data.registerForm.password"
            ref="passwordInput"
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            class="form-control form-control-lg"
            placeholder="确认密码"
            v-model="data.registerForm.surePassword"
          />
        </div>
        <div class="tip-bottom">
          <n-button
            class="btn"
            :color="store.theme == 'default' ? '#161A21' : '#409EFF'"
            @click="toRegister"
            >确认</n-button
          >
        </div>
      </div>
    </n-modal>
  </div>
</template>

<style scoped lang="less">
.tip-content {
  background-color: @primary-bg3color;
  border: 1px solid @primary-bg3color;
  box-shadow: none;
  width: 400px;
  height: 400px;
  padding: 20px;
  border-radius: 10px;
  .popup-header {
    width: 100%;
    text-align: center;
    .icon-youxiang {
      font-size: 80px;
    }
    .icon-dunpai {
      font-size: 50px;
    }
  }
  .tip-bottom {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .btn {
      width: 40%;
      height: 50px;
    }
  }
}
.form-group {
  margin-bottom: 40px;
}
.form-code {
  border: 1px solid @primary-bg3color;
  background-color: @primary-bg3color;
  color: @input-border-txcolor;
  box-shadow: none;
  border-radius: 5px;
  font-weight: 400;
  display: block;
  width: 60%;
  margin: 0 auto;
  border-bottom: 1px solid #fff;
  text-align: center;
}
.form-control {
  border: 1px solid @input-border-color;
  background-color: @input-border-color;
  color: @input-border-txcolor;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-radius: 5px;
  font-weight: 400;
  display: block;
  width: 80%;
  outline: none;
  margin: 0 auto;
}
.form-control-lg {
  font-size: 18px;
  line-height: 1.5;
  padding: 5px 8px;
  height: 50px;
}
.main {
  width: 100%;
  min-width: 1200px;
  height: 100%;
  background-color: @primary-bgcolor;
  display: flex;
  align-items: center;
  justify-content: center;
  .sign-main {
    width: 960px;
    height: 500px;
    display: flex;
    padding: 10px;
    background: @primary-bg2color;
    box-shadow: inset 9px 9px 18px @boxshow-color,
      inset -9px -9px 18px @boxshow-color2;
    border-radius: 20px;
    .image-box {
      width: 50%;
      height: 100%;
      // background-image: url("../../assets/img/funny.jpg");
      background-size: cover;
      background-repeat: no-repeat;
      border-radius: 20px;
      overflow: hidden;
    }
    .sign-box {
      width: 50%;
      height: 100%;
      padding: 14px;
      .sign-bottom {
        margin-top: 20px;
        color: #fff;
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
        div {
          cursor: pointer;
        }
      }

      .title-box {
        margin-bottom: 50px;
        height: 60px;
        .title {
          text-align: center;
          font-weight: 900;
          color: @primary-txcolor;
          font-size: 28px;
          margin-right: 20px;
        }
        .icon-shuaxin {
          font-size: 35px;
          cursor: pointer;
          color: @primary-color;
        }
      }

      .login-btn {
        width: 80%;
        height: 50px;
      }
    }
  }
}
</style>
