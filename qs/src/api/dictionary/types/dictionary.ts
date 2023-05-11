// 新增&编辑
export interface ICreateDictionaryRequestData {
  //id
  id?: string
  //描述
  name?: string
  //字典类型
  type?: string
  //数据值
  value?: string
  //创建时间
  crDate?: string
  //修改时间
  opDate?: string
}

export interface IGetDictionaryImgsData {
  delTag?: number //删除标记
  imageName: string
  imageUrl: string
  imgHeight: number
  imgWidth: number
  trueImageUrl: string
}

export interface IGetDictionaryRequestData {
  /** 当前页码 */
  pageIndex: number
  /** 查询条数 */
  pageSize: number
  //描述
  name: string
}

export interface IGetDictionaryData {
  id: string
  name: string
  //字典类型
  type: string
  //数据值
  value: string
  //创建时间
  crDate: string
  //修改时间
  opDate: string
}

export type GetDictionaryResponseData = IApiResponseData<{
  list: IGetDictionaryData[]
  total: number
}>
