const { host, port } = require('../const/constants')
module.exports = {
	baseTemplate: `
import http from './http'
`,
	notesTempalte: `
/**
 * @Date: [dateTime]
 * @Desc: [name]【所属模块：[groupName]】[bodyParams][queryParams][jsonParams]
 */
`,
	getTemplate: `export function [requestName] (params = {}) {
  return http.[method]([requestUrl], { params })
}
`,
	postTemplate: `export function [requestName] (params = {}) {
  return http.[method]([requestUrl], params)
}
`,
	projectId: '',
	host,
	port,
	dest: './src/api/mock'
}
/**
各内容字段释意如下：
dateTime: 接口方法生成的时间
name： 接口说明
groupName: 接口在yapi中所属分组名称
bodyParams: body参数
queryParams: query参数
requestName: 请求方法名称
method: 请求类型
requestUrl: 接口地址
*/
