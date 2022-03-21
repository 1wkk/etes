import { ELEMENT, ROOT } from '../constants'

const dump = (node, indent = 0) => {
  const type = node.type
  const desc = type === ROOT ? '' : type === ELEMENT ? node.tag : node.content
  console.log(`${' '.repeat(indent)}${type} ${desc}`)
  if (node.children) {
    node.children.forEach(child => dump(child, indent + 2))
  }
}

export default dump
