import { ELEMENT, FUNCTIONDECL, RETURNSTATEMENT, ROOT, TEXT } from './constants'
import traverse from './traverse'

import {
  createStringLiteral,
  createCallExpression,
  createArrayExpression,
  createIdentifier
} from './utils/create'

const transform = ast => {
  const context = {
    currentNode: null,
    childIndex: 0,
    parent: null,
    replaceNode: node => {
      context.parent.children[context.childIndex] = node
      context.currentNode = node
    },
    removeNode: () => {
      context.parent.children.splice(context.childIndex, 1)
      context.currentNode = null
    },
    transforms: [transformText, transformElement, transformRoot]
  }
  traverse(ast, context)
}

const transformText = node => {
  if (node.type !== TEXT) return
  node.jsNode = createStringLiteral(node.content)
}

const transformElement = node => {
  return () => {
    if (node.type !== ELEMENT) return
    const callExp = createCallExpression('h', [createStringLiteral(node.tag)])

    node.children.length === 1
      ? callExp.arguments.push(node.children[0].jsNode)
      : callExp.arguments.push(createArrayExpression(node.children.map(c => c.jsNode)))

    node.jsNode = callExp
  }
}

const transformRoot = node => {
  return () => {
    if (node.type !== ROOT) return

    const vnodeJSAST = node.children[0].jsNode

    node.jsNode = {
      type: FUNCTIONDECL,
      id: createIdentifier('render'),
      params: [],
      body: [
        {
          type: RETURNSTATEMENT,
          return: vnodeJSAST
        }
      ]
    }
  }
}

export default transform
