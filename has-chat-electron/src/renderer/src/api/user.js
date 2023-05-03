import request from "../utils/request";

// 通过Id获取用户信息
export function getUserById(data) {
  return request({
    url: "/api/getUserById",
    method: "post",
    data
  });
}

// 获取用户列表
export function userList(data) {
  return request({
    url: "/api/userList",
    method: "post",
    data
  });
}

// 登陆
export function login(data) {
  return request({
    url: "/api/login",
    method: "post",
    data
  });
}

// 发送邮箱验证码
export function sendVerificationCode(data) {
  return request({
    url: "/api/sendVerificationCode",
    method: "post",
    data
  });
}

// 注册
export function register(data) {
  return request({
    url: "/api/register",
    method: "post",
    data
  });
}

// 随机获取一位用户
export function getRandomUser(data) {
  return request({
    url: "/api/getRandomUser",
    method: "post",
    data
  });
}

// 检验验证码
export function checkVerificationCode(data) {
  return request({
    url: "/api/checkVerificationCode",
    method: "post",
    data
  });
}