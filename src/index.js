const http = require('http')
const qs = require('querystring')
const path = require('path')
const fs = require('fs')
const parseApiContent = require('./parseApis')
let userConfig = null // 用户自定义配置信息
const defaultConfig = require('../config/defaultConfig') // 默认配置信息
const { createFile, errorMsg, normalMsg, successMsg } = require('../utils/common')
const userConfigPath = path.join(process.cwd(), './', `mock-config.js`) // 用户自定义配置文件路径

function genApiFile() {
  if (!fs.existsSync(userConfigPath)) {
    errorMsg('请先运行【yapi-tool init】命令生成mock-config.js文件')
    return
  }
  userConfig = require(userConfigPath)
	// 合并用户配置和默认配置，未填写的非必填项配置直接使用默认值
	const newConfig = {
		baseTemplate: userConfig.baseTemplate || defaultConfig.baseTemplate,
		notesTempalte: userConfig.notesTempalte || defaultConfig.notesTempalte,
		getTemplate: userConfig.getTemplate || defaultConfig.getTemplate,
		postTemplate: userConfig.postTemplate || defaultConfig.postTemplate,
		projectId: userConfig.projectId,
		host: userConfig.host || defaultConfig.host,
		port: userConfig.port || defaultConfig.port,
		dest: userConfig.dest || defaultConfig.dest,
    cookie: userConfig.cookie
	}
	const { projectId, cookie } = newConfig
	if (projectId === null || projectId === undefined || !projectId.length) {
		errorMsg('请先配置mock-config.js中projectId值')
		return
	}
	if (!cookie) {
		errorMsg('请先配置mock-config.js中cookie值')
		return
	}

	if (typeof projectId === 'string') {
		doRequest(newConfig, projectId)
	}

	if (Object.prototype.toString.call(projectId) === '[object Array]') {
		projectId.forEach((item) => {
			doRequest(newConfig, item)
		})
	}
}

function doRequest(newConfig, pid) {
  const { host, port, cookie } = newConfig
	const data = { type: 'json', pid, status: 'all', isWiki: 'false' } // 导出参数

	const options = {
		hostname: host,
		port: port,
		path: '/api/plugin/export?' + qs.stringify(data),
		method: 'GET',
		headers: {
			Cookie: cookie
		}
	}

	const req = http.request(options, function (res) {
		normalMsg('正在生成接口文件……\n')
		let content = ''
		res.setEncoding('utf8')
		res.on('data', function (chunk) {
			content += chunk
		})
		res.on('end', () => {
			try{
				createFile('./api.json', content)
				parseApiContent(content, { ...newConfig, projectId: pid })
				successMsg('接口文件生成成功！')
			} catch(e) {
				errorMsg('接口文件生成出错了:')
				errorMsg(e)
			}
		})
	})

	req.on('error', function (e) {
		console.log('problem with request: ' + e.message)
	})

	req.end()
}

module.exports = genApiFile
