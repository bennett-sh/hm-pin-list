
import { error } from './logger.js'

export function getDisplayFromHash(hashlist: [string, string][], hash: string): string {
  let mapped = hashlist.find(entry => entry[0].startsWith(hash))

  if(!mapped) return hash
  if(mapped[1].length < 0) {
    error(`hash ${hash} not found in hashlist`, false)
    return mapped[0]?.length > 0 ? mapped[0] : hash
  }

  return `${mapped[1]} - ${mapped[0]}`
}
