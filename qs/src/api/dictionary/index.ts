import { request } from "@/utils/service"
import type * as Dictionary from "./types/dictionary"

/** 增 */
export function createDictionaryDataApi(data: Dictionary.ICreateDictionaryRequestData) {
  return request({
    url: "api/admin/dataDictionary/insert",
    method: "post",
    data
  })
}

/** 删 */
export function deleteDictionaryDataApi(id: string) {
  return request({
    url: `api/admin/dataDictionary/delete?id=${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateDictionaryDataApi(data: Dictionary.ICreateDictionaryRequestData) {
  return request({
    url: "api/admin/dataDictionary/update",
    method: "post",
    data
  })
}

/** 查列表 */
export function getDictionaryDataApi(data: Dictionary.IGetDictionaryRequestData) {
  return request<Dictionary.GetDictionaryResponseData>({
    url: "api/admin/dataDictionary/list",
    method: "post",
    data
  })
}

/**查详情 */
export function getDictionaryDetailsApi(data: string) {
  return request({
    url: `api/admin/dataDictionary/getOne?id=${data}`,
    method: "get"
  })
}
