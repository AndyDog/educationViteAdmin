import { request } from "@/utils/service"
import type * as Table from "./types/table"

/** 增 */
export function createTableDataApi(data: Table.ICreateTableRequestData) {
  return request({
    url: "table",
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

/** 查 */
export function getTableDataApi(params: any) {
  return request({
    url: "/user/queryImages",
    method: "post",
    params
  })
}

/** 上传图片 */
export function upLoadImageApi(params: any) {
  return request({
    url: "/user/upLoadImage",
    method: "post",
    params
  })
}

/** 增新增-修改图片管理*/
export function addImagesApi(data: any) {
  return request({
    url: "/user/addImages",
    method: "post",
    data
  })
}
