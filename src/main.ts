
import { mkdir, readFile, readdir, rm, writeFile } from 'fs/promises'
import { existsSync as exists } from 'fs'
import { error, info } from './logger.js'
import { argv, argv0 } from 'process'
import { join, resolve } from 'path'
import { getDisplayFromHash } from './hash_list.js'

async function main() {
  if(argv.length < 3) {
    error(`Usage: ${argv0} [path to QNE game file extensions]`)
  }

  const gfe = resolve(argv[2])

  if(!exists(gfe)) {
    error(`Specified GFE path (${gfe}) doesn't exist!`)
  }

  const pinsJSON = join(gfe, 'pins.json')

  if(!exists(pinsJSON)) {
    error(`Invalid GFE folder: no pins.json.`)
  }

  const hashlistTxt = join(gfe, 'hash_list2.txt')

  if(!exists(hashlistTxt)) {
    error('Invalid GFE folder: no hash_list2.txt.')
  }

  const hashlist: [string, string][] = (await readFile(hashlistTxt, { encoding: 'utf-8' }))
    .split('\n')
    .filter(line => !line.startsWith('#')) // Comments
    .map(line => line.trim().split(',')) // Split by ,
    .map(line => [line[0], line[1]?.length > 1 ? line.slice(1).join(',') : line[1]]) // Merge right-hand commas

  const _pins = JSON.parse(await readFile(pinsJSON, { encoding: 'utf-8' }))

  const outputFile = join('.', 'output.txt')

  if(exists(outputFile)) await rm(outputFile)

  for(const [hash, pins] of Object.entries(_pins) as [string, { input: string[], output: string[] }][]) {
    if(!pins.input || !pins.output) return

    info(`processing ${hash}`)

    let content = '\n\n' + getDisplayFromHash(hashlist, hash)

    if(pins.input?.length > 0) {
      content += '\n** Input Pins:'
      content += pins.input.map(pin => `\n- ${pin.replace(/,/g, '')}`)
    }
    
    if(pins.output?.length > 0) {
      content += '\n** Output Pins:'
      content += pins.output.map(pin => `\n- ${pin.replace(/,/g, '')}`)
    }

    await writeFile(outputFile, content.replace(/,/g, ''), { flag: 'a' })
  }
}

main()
