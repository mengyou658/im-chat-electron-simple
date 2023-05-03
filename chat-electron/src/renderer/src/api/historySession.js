import request from "../utils/request";

// 获取历史会话列表
export function getHistorySessionById(data) {
  return request({
    url: "/api/getHistorySessionById",
    method: "post",
    data
  });
}

// 插入历史会话
export function insertHistorySession(data) {
  return request({
    url: "/api/insertHistorySession",
    method: "post",
    data
  });
}