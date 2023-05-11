// 新增&编辑
export interface ICreateMarketingRequestData {
  //id
  id?: string
  isValidNew?: any
  //全封面图URL
  trueImgUrl: any
  beginEndTime?: any
  beginExp?: any
  endExp?: any
  isSale?: any
  bannerType?: any
  bannerTitle?: any
  linkAction?: any
  path?: any
  imgSeq?: number
}

export interface IGetMarketingImgsData {
  delTag?: number //删除标记
  imageName: string
  imageUrl: string
  imgHeight: number
  imgWidth: number
  trueImageUrl: string
}

export interface IGetMarketingTargetStages {
  speed: string
  targetStage: number | undefined
}

export interface IUpdateMarketingRequestData {
  id: string
  username: string
  password?: string
}

export interface IGetMarketingRequestData {
  /** 当前页码 */
  pageIndex: number
  /** 查询条数 */
  pageSize: number
  /** ID */
  id?: number | string
  /** 营销位名称 */
  bannerTitle?: string
  /** 课程分类 */
  motionType?: unknown | number | string
  /** 上架状态 */
  isSale?: any
  /** 创建时间开始 */
  beginDate?: string
  /** 创建时间结束 */
  endDate?: string
  nickName?: string
  phone?: string
  marketingSource?: string
  //
}

export interface IGetMarketingData {
  createTime: string
  email: string
  id: string
  phone: string
  roles: string
  status: boolean
  username: string
  marketingName: string //课程名称
}

export type GetMarketingResponseData = IApiResponseData<{
  list: IGetMarketingData[]
  total: number
}>

// export interface IGetMarketingRequestDetails {
//   id: number | string
// }
