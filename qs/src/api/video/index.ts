import { request } from "@/utils/service"
// import type * as Video from "./types/video"

export function getVideoVoucherApi(data: string) {
  return request({
    url: `/api/admin/vod/getVideoUploadAuth?videoName=${data}`,
    method: "get"
  })
}
