import { request } from "@/utils/service"
import type * as AppVersion from "./types/appVersion"

/** 增 */
export function createAppVersionDataApi(data: AppVersion.ICreateAppVersionRequestData) {
  return request({
    url: "api/admin/appVersion/insert",
    method: "post",
    data
  })
}

// /** 删 */
// export function deleteAppVersionDataApi(id: string) {
//   return request({
//     url: `api/admin/appVersion/deleteAppVersion?id=${id}`,
//     method: "delete"
//   })
// }

// /** 改 */
// export function updateAppVersionDataApi(data: AppVersion.ICreateAppVersionRequestData) {
//   return request({
//     url: "api/admin/appVersion/editAppVersion",
//     method: "post",
//     data
//   })
// }

/** 查列表 */
export function getAppVersionDataApi(data: AppVersion.IGetAppVersionRequestData) {
  return request<AppVersion.GetAppVersionResponseData>({
    url: "api/admin/appVersion/list",
    method: "post",
    data
  })
}

// /**查详情 */
// export function getAppVersionDetailsApi(data: string) {
//   return request({
//     url: `api/admin/appVersion/details?id=${data}`,
//     method: "get"
//   })
// }
