interface IUser {
  first_name: string
  last_name: string
  email: string
}

export interface IAuthenticationCookies {
  user_id: string
  user: IUser
  iat: number
  exp: number
} 