import { request } from "@/utils/service"

/** 增加用户 */
export function useraddUser(data: any) {
  return request({
    url: "/user/addUser",
    method: "post",
    data
  })
}

/** 查询用户 */
export function usergetByUserLike(data: any) {
  return request({
    url: "/user/getByUserLike",
    method: "post",
    data
  })
}

/** 删除用户 */
export function userdeleteUser(data: any) {
  return request({
    url: "/user/deleteUser",
    method: "post",
    data
  })
}

/** 更新用户 */
export function userupdateUser(data: any) {
  return request({
    url: "/user/updateUser",
    method: "post",
    data
  })
}

// -------------------------------------角色
/** 增加角色 */
export function useraddRole(data: any) {
  return request({
    url: "/user/addRole",
    method: "post",
    data
  })
}

/** 查询角色 */
export function usergetRole(data: any) {
  return request({
    url: "/user/getRole",
    method: "post",
    data
  })
}

/** 删除角色 */
export function userdeleteRole(data: any) {
  return request({
    url: "/user/deleteRole",
    method: "post",
    data
  })
}

/** 更新角色 */
export function userupdateRole(data: any) {
  return request({
    url: "/user/updateRole",
    method: "post",
    data
  })
}

/** 查询角色下用户 */
export function usergetRoleUser(data: any) {
  return request({
    url: "/user/getRoleUser",
    method: "post",
    data
  })
}
