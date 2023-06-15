import { IUserInfo } from "./refresh-result"

export interface IVerifyResult {
    accessToken: string
    refreshToken: string
    userInfo: IUserInfo
}