export interface ILoginRequestData {
  /** admin 或 editor */
  userName: "admin" | "editor"
  /** 密码 */
  passWord: string
  /** 验证码 */
  imageCode: string
}

export type LoginCodeResponseData = IApiResponseData<string>

export type LoginResponseData = IApiResponseData<{ token: string }>

export type UserInfoResponseData = IApiResponseData<{ username: string; roles: string[] }>
