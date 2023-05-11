import { request } from "@/utils/service"
import type * as User from "./types/user"

/** 增 */
// export function createUserDataApi(data: User.ICreateUserRequestData) {
//   return request({
//     url: "api/admin/course/addCourse",
//     method: "post",
//     data
//   })
// }

// /** 删 */
// export function deleteUserDataApi(id: string) {
//   return request({
//     url: `api/admin/course/deleteCourse?id=${id}`,
//     method: "delete"
//   })
// }

// /** 改 */
// export function updateUserDataApi(data: User.IUpdateUserRequestData) {
//   return request({
//     url: "api/admin/course/editCourse",
//     method: "post",
//     data
//   })
// }

/** 查 */
export function getUserDataApi(data: User.IGetUserRequestData) {
  return request<User.GetUserResponseData>({
    url: "api/admin/user/listAsPages",
    method: "post",
    data
  })
}

// 导出

export function getExport(data: User.IGetUserData) {
  return request({
    url: "api/admin/user/export",
    method: "post",
    data
  })
}
