/** 统一处理 Cookie */

import CacheKey from "@/constants/cacheKey"
import Cookies from "js-cookie"

export const getToken = () => {
  return Cookies.get(CacheKey.TOKEN)
}
export const setToken = (token: string) => {
  Cookies.set(CacheKey.TOKEN, token)
}
export const removeToken = () => {
  Cookies.remove(CacheKey.TOKEN)
}

export const setUserName = (username: any) => {
  Cookies.set(CacheKey.USER_NAME, username)
}

export const getUserName = () => {
  return Cookies.get(CacheKey.USER_NAME)
}

export const setavatarUrl = (avatarurl: any) => {
  Cookies.set(CacheKey.USER_AVATAR_URL, avatarurl)
}

export const getavatarUrl = () => {
  return Cookies.get(CacheKey.USER_AVATAR_URL)
}
