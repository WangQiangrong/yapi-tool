const fs = require('fs')
const path = require('path')
const { createFile, normalMsg, successMsg, errorMsg } = require('../utils/common')
// 读取默认的用户配置文件，生成新的配置文件用户项目路径下
function genUserConfigFile () {
  normalMsg('正在生成配置文件……\n')
  fs.readFile(path.join(__dirname, '../config/userConfigTemplate.js'), 'utf-8', function (err, data) {
    if (err) {
      errorMsg('生成配置文件失败\n')
      errorMsg(err)
    } else {
      createFile(path.join(process.cwd(), './', `mock-config.js`), data)
      successMsg('配置文件已生成！')
    }
  })
}

module.exports = genUserConfigFile
