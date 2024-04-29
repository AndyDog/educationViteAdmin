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
export function deleteTableDataApi(data: any) {
  return request({
    url: `/user/deleteImages`,
    method: "post",
    data
  })
}

/** 改 */
export function updateTableDataApi(data: any) {
  return request({
    url: "/user/addImages",
    method: "post",
    data
  })
}

/** 查询公开公告管理列表  */
export function announcementlist(params: any) {
  return request({
    url: "/user/queryImages",
    method: "post",
    params
  })
}
