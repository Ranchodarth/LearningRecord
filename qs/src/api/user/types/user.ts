export interface IUpdateUserRequestData {
  id: string
  username: string
  password?: string
}

export interface IGetUserRequestData {
  /** 当前页码 */
  pageIndex: number
  /** 查询条数 */
  pageSize: number
  /** 用户姓名 */
  nickName?: string
  /** 手机号 */
  phone?: string
  /** 渠道 */
  userSource?: string
}

export interface IGetUserData {
  crDate: string
  nickName: string
  id: string
  phone: string
  userSource: string
  city: string
}

export type GetUserResponseData = IApiResponseData<{
  list: IGetUserData[]
  total: number
}>
