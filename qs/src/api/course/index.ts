import { request } from "@/utils/service"
import type * as Course from "./types/course"

/** 增 */
export function createCourseDataApi(data: Course.ICreateCourseRequestData) {
  return request({
    url: "api/admin/course/addCourse",
    method: "post",
    data
  })
}

/** 删 */
export function deleteCourseDataApi(id: string) {
  return request({
    url: `api/admin/course/deleteCourse?id=${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateCourseDataApi(data: Course.ICreateCourseRequestData) {
  return request({
    url: "api/admin/course/editCourse",
    method: "post",
    data
  })
}

/** 查列表 */
export function getCourseDataApi(data: Course.IGetCourseRequestData) {
  return request<Course.GetCourseResponseData>({
    url: "api/admin/course/listAsPages",
    method: "post",
    data
  })
}

/**查详情 */
export function getCourseDetailsApi(data: string) {
  return request({
    url: `api/admin/course/details?id=${data}`,
    method: "get"
  })
}
