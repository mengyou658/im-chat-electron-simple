import request from "../utils/request";

// 获取会话信息列表
export function getContentBySendId(data) {
  return request({
    url: "/api/getContentBySendId",
    method: "post",
    data
  });
}