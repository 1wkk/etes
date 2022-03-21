import { ELEMENT, ROOT, TAG, TAGEND, TEXT } from './constants'
import tokenize from './tokenize'

const parse = (str: string) => {
  const tokens = tokenize(str)
  const root: any = {
    type: ROOT,
    children: []
  }

  const elementStack = [root]
  while (tokens.length) {
    const parent = elementStack[elementStack.length - 1]

    const t = tokens.shift()
    switch (t.type) {
      case TAG:
        const elementNode = {
          type: ELEMENT,
          tag: t.name,
          children: []
        }
        parent.children.push(elementNode)
        elementStack.push(elementNode)
        break
      case TEXT:
        const textNode = {
          type: TEXT,
          content: t.content
        }
        parent.children.push(textNode)
        break
      case TAGEND:
        elementStack.pop()
        break
      default:
        console.log(`unsupported token type: ${t.type}`)
        break
    }
  }
  return root
}

export default parse
