import dayjs from "dayjs"
import { request } from "@/utils/service"
import { ElMessage } from "element-plus"

/** 格式化时间 */
export const formatDateTime = (time: string | number | Date) => {
  if (!time) {
    return "N/A"
  }
  const date = new Date(time)
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
}

/** 将全局 CSS 变量导入 JS 中使用 */
export const getCssVariableValue = (cssVariableName: string) => {
  let cssVariableValue = ""
  try {
    // 没有拿到值时，会返回空串
    cssVariableValue = getComputedStyle(document.documentElement).getPropertyValue(cssVariableName)
  } catch (error) {
    console.error(error)
  }
  return cssVariableValue
}

/**
 *
 * @param url 目标下载接口
 * @param query 查询参数
 * @param fileName 文件名称
 * @returns {*}
 */
export const downBlobFile = (url: string, query: any, fileName: string) => {
  console.log("query", query)
  return request({
    url: url,
    method: "post",
    responseType: "blob",
    data: query
  }).then((response: any) => {
    // 处理返回的文件流
    console.log(response)
    const blob = response
    if (blob && blob.size === 0) {
      ElMessage.warning("内容为空，无法下载")
      return
    }
    const link = document.createElement("a")
    const binaryData = []
    binaryData.push(blob)
    link.href = window.URL.createObjectURL(new Blob(binaryData))
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    window.setTimeout(function () {
      window.URL.revokeObjectURL(blob)
      document.body.removeChild(link)
    }, 0)
  })
}
