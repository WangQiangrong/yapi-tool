
import http from './http'

let baseUrl = ''
if (isMockEnv) { // 是否为mock环境
  baseUrl = 'http://yapi.test.com:80/mock/2024'
}

/**
 * @Author: 开发者名称
 * @Date: 2021-3-23 19:21:23
 * @Desc: test
 * @Param【query】:
 *        param1 -> 参数一 【必须】
 */
export function test (params = {}) {
  return http.get(`${baseUrl}/test`, { params })
}

/**
 * @Author: 开发者名称
 * @Date: 2021-3-23 19:21:23
 * @Desc: 获取用户信息
 * @Param【body】:
 *        userId -> 用户id 【必须】
 * @Param【query】:
 *        time -> 时间戳 【必须】
 */
export function userGetUserInfo (params = {}) {
  return http.post(`${baseUrl}/api/test/user/getUserInfo`, params)
}
