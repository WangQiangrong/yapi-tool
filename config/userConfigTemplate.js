module.exports = {
	// 基础内容，展示在接口文件顶部【非必填，不填则使用默认值，如下配置即为默认值】
	baseTemplate: `
import http from './http'
`,
	// 注释模板【非必填，不填则使用默认值，如下配置即为默认值】
	notesTempalte: `
/**
 * @Author: 开发者名称
 * @Date: [dateTime]
 * @Desc: [name][bodyParams][queryParams][jsonParams]
 */
`,
	// get方法模板【非必填，不填则使用默认值，如下配置即为默认值】
	getTemplate: `export function [requestName] (params = {}) {
  return http.[method]([requestUrl], { params })
}
`,
	// post方法模板【非必填，不填则使用默认值，如下配置即为默认值】
	postTemplate: `export function [requestName] (params = {}) {
  return http.[method]([requestUrl], params)
}
`,
	// yapi平台上面的项目id【string（单个，如：'2024'）/array（多个，如：['2024','2024']）】【必填】
	projectId: '',
	// yapi平台ip【非必填】
	host: 'yapi.test.com',
	// yapi平台端口【非必填】
	port: '80',
	// 取cookie中的_yapi_token和_yapi_uid，如：_yapi_token=xxxxxxxxx;_yapi_uid=xxxx【必填】
	cookie: '',
	// 接口文件生成的目标路径，若路径不存在则自动生成，生成后的接口文件名称格式为：分组名称_projectId.js，【非必填】
	dest: './src/api/mock'
}
