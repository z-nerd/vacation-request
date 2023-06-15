export interface IUserInfo {
    _id: string, 
    fullname: string, 
    username: string, 
    role: string, 
    email: string, 
    phone: string, 
    birthday: string, 
    joinDatetime: string, 
}

export interface IRefreshResult {
    accessToken: string
    userInfo: IUserInfo
}