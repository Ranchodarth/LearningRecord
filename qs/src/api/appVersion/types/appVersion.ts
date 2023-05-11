// 新增&编辑
export interface ICreateAppVersionRequestData {
  //id
  id?: string
  //app名称
  appName?: string
  //app地址
  downloadUrl: string

  //app大小
  appSize: string
  //版本号
  appVersionCode: string
  appType: any

  //版本名称
  appVersionName: string
  remarks: string
}

// export interface IUpdateAppVersionRequestData {
//   id: string
//   username: string
//   password?: string
// }

export interface IGetAppVersionRequestData {
  /** 当前页码 */
  pageIndex: number
  /** 查询条数 */
  pageSize: number
}

export interface IGetAppVersionData {
  createTime: string
  id: string
  appName: string
  downloadUrl: string
  appType: any
  appSize: boolean
  appVersionCode: string
  appVersionName: string
  remarks: string
}

export type GetAppVersionResponseData = IApiResponseData<{
  list: IGetAppVersionData[]
  total: number
}>
