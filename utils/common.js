const fs = require('fs') // 引入fs模块
const chalk = require('chalk')
/**
 * @Author: LFE
 * @Date: 2021-03-10 15:46:43
 * @Desc: 格式化时间
 * @Parm: dateStr -> 时间参数
 */
function formateDateTime(dateStr) {
	if (!dateStr) {
		return ''
	}
	const date = new Date(dateStr)
	return [date.getFullYear(), date.getMonth(), date.getDate(), addZero(date.getHours()), addZero(date.getMinutes()), addZero(date.getSeconds())]

	function addZero(num) {
		return num < 10 ? `0${num}` : num
	}
}

/**
 * @Author: LFE
 * @Date: 2021-04-15 10:16:14
 * @Desc: 生成文件
 * @Param: filePath -> 文件路径
 *        data -> 文件内容
 */
function createFile(filePath, data) {
	if (!fs.existsSync(filePath)) {
		mkdir(filePath)
	}
	fs.writeFile(filePath, data, function (err) {
		if (err) {
			console.log(err)
		}
	})
}

/**
 * @Author: LFE
 * @Date: 2021-04-15 19:48:21
 * @Desc: 生成文件夹
 * @Param: filePath -> 文件路径
 */
function mkdir(filePath) {
	const arr = filePath.split('\\')
	let dir = arr[0]
	for (let i = 1; i < arr.length; i++) {
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir)
		}
		dir = dir + '/' + arr[i]
	}
	fs.writeFileSync(filePath, '')
}

/**
* @Author: LFE
* @Date: 2021-04-21 20:04:12
* @Desc: 弹出错误信息
*/
function errorMsg (msg) {
	console.log(chalk.red(msg))
}

/**
* @Author: LFE
* @Date: 2021-04-21 20:04:12
* @Desc: 弹出正常信息信息
*/
function normalMsg (msg) {
	console.log(chalk.white(msg))
}

/**
* @Author: LFE
* @Date: 2021-04-21 20:04:12
* @Desc: 弹出成功信息
*/
function successMsg (msg) {
	console.log(chalk.green(msg))
}

module.exports = { formateDateTime, createFile, errorMsg, normalMsg, successMsg }
