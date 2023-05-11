// 新增&编辑
export interface ICreateCourseRequestData {
  //id
  readonly id?: string
  //卡路里
  calorie?: number
  //课程描述
  courseDesc: string
  //课程相关图片
  courseImgs: IGetCourseImgsData[]
  //课程名称
  courseName: string
  //封面图URL
  coverUrl: string
  //难度等级
  difficultyLevels: number
  //距离
  distance: number | undefined
  //上下架
  isSale: number
  //课程运动类型
  motionType: number | undefined
  //速度区间
  speed: string
  //变速数据
  targetStages: IGetCourseTargetStages[]
  //课程目标类型
  targetType: number
  //全封面图URL
  trueCoverUrl: string | unknown
  durationTime?: string
}

export interface IGetCourseImgsData {
  delTag?: number //删除标记
  imageName: string
  imageUrl: string
  imgHeight: number
  imgWidth: number
  trueImageUrl: string
}

export interface IGetCourseTargetStages {
  speed: string
  targetStage: number | undefined
}

export interface IUpdateCourseRequestData {
  id: string
  username: string
  password?: string
}

export interface IGetCourseRequestData {
  /** 当前页码 */
  pageIndex: number
  /** 查询条数 */
  pageSize: number
  /** 课程ID */
  id?: number | string
  /** 课程名称 */
  courseName?: string
  /** 课程分类 */
  motionType?: unknown
  /** 上架状态 */
  isSale?: unknown
  /** 创建时间开始 */
  beginDate?: string
  /** 创建时间结束 */
  endDate?: string
  //
}

export interface IGetCourseData {
  createTime: string
  email: string
  id: string
  phone: string
  roles: string
  status: boolean
  username: string
  courseName: string //课程名称
}

export type GetCourseResponseData = IApiResponseData<{
  list: IGetCourseData[]
  total: number
}>

// export interface IGetCourseRequestDetails {
//   id: number | string
// }
