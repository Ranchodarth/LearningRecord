import { request } from "@/utils/service"
import type * as Basic from "./types/basic"

/** 获取线上图片地址 */
export function getUploadUrl(data: Basic.UploadRequestData) {
  return request<Basic.UploadResponseData>({
    url: `api/admin/user/getUrltoHttp?url=${data.url}`,
    method: "get"
  })
}
