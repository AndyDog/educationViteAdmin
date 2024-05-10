import { request } from "@/utils/service"

/** 增加公告管理 */
export function announcementadd(data: any) {
  return request({
    url: "/announcement/add",
    method: "post",
    data
  })
}

/** 删 */
export function announcementdelete(data: any) {
  return request({
    url: `/announcement/delete`,
    method: "post",
    data
  })
}

/** 改 */
export function announcementupdate(data: any) {
  return request({
    url: "/announcement/update",
    method: "post",
    data
  })
}

/** 查询公开公告管理列表  */
export function announcementquery(data: any) {
  return request({
    url: "/announcement/query",
    method: "post",
    data
  })
}
