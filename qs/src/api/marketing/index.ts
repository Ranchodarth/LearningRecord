import { request } from "@/utils/service"
import type * as Marketing from "./types/marketing"

/** 增 */
export function createMarketingDataApi(data: Marketing.ICreateMarketingRequestData) {
  return request({
    url: "api/admin/banner/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteMarketingDataApi(id: string) {
  return request({
    url: `api/admin/banner/delete`,
    method: "delete",
    params: {
      id: id
    }
  })
}

/** 改 */
export function updateMarketingDataApi(data: Marketing.ICreateMarketingRequestData) {
  return request({
    url: "api/admin/banner/edit",
    method: "post",
    data
  })
}

/** 查列表 */
export function getMarketingDataApi(data: Marketing.IGetMarketingRequestData) {
  return request<Marketing.GetMarketingResponseData>({
    url: "api/admin/banner/list",
    method: "post",
    data
  })
}

/**查详情 */
export function getMarketingDetailsApi(data: string) {
  return request({
    url: `api/admin/banner/detail?id=${data}`,
    method: "get"
  })
}

/** 导出 */
export function leadingOut(data: string) {
  return request({
    url: `api/admin/banner/export`,
    method: "get",
    params: data
  })
}
