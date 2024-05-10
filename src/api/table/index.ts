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

/** 查 静态图片 */
export function getTableDataApi(data: any) {
  return request({
    url: "/user/queryImages",
    method: "post",
    data
  })
}

/** 上传图片 静态图片 */
export function upLoadImageApi(data: any) {
  return request({
    url: "/user/upLoadImage",
    method: "post",
    data
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

/** 课程管理_获取课程列表*/
export function queryCourseListApi(data: any) {
  return request({
    url: "/base/queryCourseList",
    method: "post",
    data
  })
}

/** 课程管理_增加课程*/
export function addCourse(data: any) {
  return request({
    url: "/base/addCourse",
    method: "post",
    data
  })
}

/** 课程管理_删除课程*/
export function deleteCourse(data: any) {
  return request({
    url: "/base/deleteCourse",
    method: "post",
    data
  })
}

/** 课程管理_更新课程*/
export function updateCourse(data: any) {
  return request({
    url: "/base/updateCourse",
    method: "post",
    data
  })
}

/** 培训信息-获取列表*/
export function queryInfomationList(data: any) {
  return request({
    url: "/training/queryInfomationList",
    method: "post",
    data
  })
}

/** 培训信息-增加*/
export function addInfomation(data: any) {
  return request({
    url: "/training/addInfomation",
    method: "post",
    data
  })
}

/** 培训信息-删除*/
export function deleteInfomation(data: any) {
  return request({
    url: "/training/deleteInfomation",
    method: "post",
    data
  })
}

/** 培训信息-修改*/
export function updateInfomation(data: any) {
  return request({
    url: "/training/updateInfomation",
    method: "post",
    data
  })
}

// 培训课程信息----------------------------------

/** 培训课程信息-获取列表*/
export function getTrainingCourse(data: any) {
  return request({
    url: "/training/getTrainingCourse",
    method: "post",
    data
  })
}

/** 培训课程信息-增加*/
export function addTrainingCourse(data: any) {
  return request({
    url: "/training/addTrainingCourse",
    method: "post",
    data
  })
}

/** 培训课程信息-删除*/
export function deleteTrainingCourse(data: any) {
  return request({
    url: "/training/deleteTrainingCourse",
    method: "post",
    data
  })
}

/** 培训课程信息-修改*/
export function updateTrainingCourse(data: any) {
  return request({
    url: "/training/updateTrainingCourse",
    method: "post",
    data
  })
}

// -----------------字典

/** 查询字典列表*/
export function queryaDictionariesLike(data: any) {
  return request({
    url: "/platform/queryaDictionariesLike",
    method: "post",
    data
  })
}

/** 修改字典列表*/
export function updataDictionaries(data: any) {
  return request({
    url: "/platform/updataDictionaries",
    method: "post",
    data
  })
}

/** 删除字典列表*/
export function deleteDictionaries(data: any) {
  return request({
    url: "/platform/deleteDictionaries",
    method: "post",
    data
  })
}

/** 增加字典管理列表*/
export function addDictionaries(data: any) {
  return request({
    url: "/platform/addDictionaries",
    method: "post",
    data
  })
}

// 查询字典详情

/** 查询字典列表详情*/
export function queryDictionariesDetailLike(data: any) {
  return request({
    url: "/platform/queryDictionariesDetailLike",
    method: "post",
    data
  })
}

/** 修改字典列表详情*/
export function updateDictionariesDetail(data: any) {
  return request({
    url: "/platform/updateDictionariesDetail",
    method: "post",
    data
  })
}

/** 删除字典列表详情*/
export function deleteDictionariesDetail(data: any) {
  return request({
    url: "/platform/deleteDictionariesDetail",
    method: "post",
    data
  })
}

/** 增加字典管理详情*/
export function addDictionaiesDetail(data: any) {
  return request({
    url: "/platform/addDictionaiesDetail",
    method: "post",
    data
  })
}

// 用户培训信息

/** 用户培训信息-获取列表*/

export function getUserTraining(data: any) {
  return request({
    url: "/training/getUserTraining",
    method: "post",
    data
  })
}

/** 用户培训信息_增加*/
export function addUserTraining(data: any) {
  return request({
    url: "/training/addUserTraining",
    method: "post",
    data
  })
}

/** 用户培训信息_删除*/
export function deleteUserTraining(data: any) {
  return request({
    url: "/training/deleteUserTraining",
    method: "post",
    data
  })
}

/** 用户培训信息-修改*/
export function updateUserTraining(data: any) {
  return request({
    url: "/training/updateUserTraining",
    method: "post",
    data
  })
}

/** 用户课表-获取列表*/
export function getUserTrainingDetail(data: any) {
  return request({
    url: "/training/getUserTrainingDetail",
    method: "post",
    data
  })
}
