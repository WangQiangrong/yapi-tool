const { formateDateTime, createFile } = require('../utils/common')
const { baseUrlName } = require('../const/constants')
const path = require('path')
let configData = {}

/**
 * @Author: LFE
 * @Date: 2021-04-13 15:36:26
 * @Desc: 解析接口内容
 * @Param: data -> 分组列表
 *        config -> 配置信息
 */
function parseApiContent(data, config) {
	configData = config
	if (!data) return
	const arr = JSON.parse(data)
	const groups = {} // 定义接口分组
	if (!arr.length) return
	arr.forEach((item) => {
		const { name, list } = item
		groups[name] = parseApiList(list, name) // 以分组名称为key保存接口列表
	})
	genApiFileByGroup(groups)
}

/**
 * @Author: LFE
 * @Date: 2021-04-13 15:36:42
 * @Desc: 解析接口信息
 * @Param: arr -> 接口列表
 *        groupName -> 分组名称
 */

function parseApiList(arr, groupName) {
	const groupApis = [] // 分组下的接口列表
	if (arr.length) {
		arr.forEach((item) => {
			const { title, path, method, req_query, req_body_form, req_body_other } = item
			groupApis.push({
				groupName,
				name: title,
				path,
				method,
				queryParams: req_query,
				bodyParams: req_body_form,
				jsonParams: req_body_other ? JSON.parse(req_body_other) : { properties: [], required: 0 }
			})
		})
	}
	return groupApis
}

/**
 * @Author: LFE
 * @Date: 2021-04-13 16:31:39
 * @Desc: 根据分组信息生成文件
 * @Param: groups -> 接口分组
 */
function genApiFileByGroup(groups) {
	const keys = Object.keys(groups)
	const { baseTemplate, host, port, projectId } = configData
	keys.forEach((item) => {
		const fileName = `${item}_${projectId}.js`
		let fileContent = `${baseTemplate}
let ${baseUrlName} = ''
if (isMockEnv) { // 是否为mock环境
  ${baseUrlName} = 'http://${host}:${port}/mock/${projectId}'
}
`
		fileContent += everyApi(groups[item])
		createFile(path.join(process.cwd(), './', `${configData.dest}/${fileName}`), fileContent)
	})
}

/**
 * @Author: LFE
 * @Date: 2021-04-15 09:39:54
 * @Desc: 遍历每个接口
 * @Param: apis -> 接口列表
 */
function everyApi(apis) {
	let str = ''
	apis.forEach((item) => {
		str += fillTemplate(item)
	})
	return str
}

/**
 * @Author: LFE
 * @Date: 2021-04-15 16:10:43
 * @Desc: 生成模板中待替换的字段
 * @Param: data -> 接口信息
 */
function genFillKeys({ name, groupName, queryParams, bodyParams, path, method, jsonParams }) {
	const dateMap = formateDateTime(new Date().getTime())
	const dateTime = `${dateMap[0]}-${dateMap[1]}-${dateMap[2]} ${dateMap[3]}:${dateMap[4]}:${dateMap[5]}` // 待填充的日期字段
	const queryParamStr = genParamsStr(queryParams, 'query') // 待填充的query参数
	const bodyParamStr = genParamsStr(bodyParams, 'body') // 待填充的body参数
	const jsonParamStr = genParamsStr(normalizeJsonParams(jsonParams), 'json') // 待填充的json参数
	const requestName = genMethodName(path) // 待填充的请求方法名称
	const requestUrl = `\`$\{${baseUrlName}\}${path}\``
	const methodStr = method.toLowerCase()
	return {
		dateTime,
		name,
		groupName,
		bodyParams: bodyParamStr,
		queryParams: queryParamStr,
		jsonParams: jsonParamStr,
		requestName,
		method: methodStr,
		requestUrl
	}
}

/**
 * @Author: LFE
 * @Date: 2021-04-15 16:12:51
 * @Desc: 生成参数注释
 * @Param: params -> 参数
 *         paramType -> 参数类型
 */

function genParamsStr(params, paramType) {
	let str = ''
	if (params.length) {
		str += `
 * @Param【${paramType}】:`
		params.forEach(({ name, desc, required }) => {
			str += `
 *        ${name} -> ${desc} 【${required === '1' ? '必须' : '非必须'}】`
		})
	}
	return str
}

/**
 * @Author: LFE
 * @Date: 2021-04-15 16:17:29
 * @Desc: 生成请求方法名称【根据接口的路径，将路径中的“/”去掉，并且“/”后的字母大写】
 * @Param: path -> 接口路径
 */
function genMethodName(path) {
	const names = path.split('/')
	let methodName = path
	const len = names.length
	// 如果接口路径过长，那么取最后两个作为最终的接口名称【防止生成的接口名称过长，识别度不高】
	if (len > 2) {
		methodName = `${names[len - 2]}/${names[len - 1]}`
	}
	// 将接口路径中的“/test”格式字样替换成“Test”格式
	const reg = /\/(\w)/g
	methodName = methodName.replace(reg, (match, p1) => {
		return p1.toUpperCase()
	})
	// 将方法的第一个字母小写处理
	methodName = methodName.split('')
	methodName[0] = methodName[0].toLowerCase()
	methodName = methodName.join('')
	return methodName
}

/**
 * @Author: LFE
 * @Date: 2021-04-13 16:33:40
 * @Desc: 使用接口信息填充api模板
 * @Param: data -> 接口信息
 */

function fillTemplate(data) {
	const reg = /\[([a-zA-Z]+)\]/g
	const fillMap = genFillKeys(data)
	const { notesTempalte, getTemplate, postTemplate } = configData
	let str = ''
	if (notesTempalte) {
		str = notesTempalte.replace(reg, (match, p1) => {
			return fillMap[p1]
		})
	}
	if (fillMap.method === 'get' && getTemplate) {
		str += getTemplate.replace(reg, (match, p1) => {
			return fillMap[p1]
		})
	}
	if (fillMap.method === 'post' && postTemplate) {
		str += postTemplate.replace(reg, (match, p1) => {
			return fillMap[p1]
		})
	}
	return str
}

/**
 * @desc 格式化json格式请求字段【使其和requery和form格式的参数格式一致】
 * @returns {null}
 */
function normalizeJsonParams({ properties, required }) {
	const result = []
	if (!properties) {
		return result
	}
	Object.keys(properties).forEach((item) => {
		result.push({
			name: item,
			desc: properties[item].description || '',
			required: required === '1' ? '1' : '0'
		})
	})
	return result
}

module.exports = parseApiContent
