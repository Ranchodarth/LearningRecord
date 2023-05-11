export interface ILoginRequestData {
  /** 用户名 */
  loginName: string
  /** 密码 */
  loginPassword: string
  /** 验证码 */
  authCode: string
}

export type LoginCodeResponseData = IApiResponseData<string>

export type LoginResponseData = IApiResponseData<{ token: string; userInfo: any }>

export type UserInfoResponseData = IApiResponseData<{ loginName: string; roles: string[] }>
