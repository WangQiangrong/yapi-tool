#!/usr/bin/env node
const chalk = require('chalk')
const program = require('commander')
const packageConfig = require('../package')
const genUserConfigFile = require('../src/genUserConfig')
const genApiFile = require('../src/')
// const dowload = require('../command/dowload')
program.version(packageConfig.version).usage('<command> [options]')

// 错误命令提示
program.arguments('<command>').action((cmd) => {
  program.outputHelp()
  console.log(chalk.red(`错误命令：${cmd}`))
})

program
  .command('init')
  .description(chalk.blue('初始化配置文件'))
  .action(() => {
    genUserConfigFile()
  })

program
  .command('gen')
  .description(chalk.blue('生成接口文件'))
  .action(() => {
    genApiFile()
  })



// 命令帮助说明
program.on('--help', () => {
  console.info('命令列表:')
  console.info('    yapi-tool init ', chalk.blue('初始化配置文件'))
  console.info('    yapi-tool gen ', chalk.blue('生成接口文件'))
})

program.parse(process.argv)

