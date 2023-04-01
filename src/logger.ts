
import { exit as _exit } from 'process'
import chalk from 'chalk'

export function error(text: string, exit = true) {
  console.log(chalk.redBright(text))
  if(exit) _exit(1)
}

export function warn(text: string) {
  console.log(chalk.yellowBright(text))
}

export function info(text: string) {
  console.log(chalk.blueBright(text))
}

export function verbose(text: string) {
  console.log(text)
}
