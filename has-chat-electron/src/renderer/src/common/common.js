export default {
  // 是否登陆
  isLogin() {
    return window.localStorage.getItem("token") ? true : false;
  }
}