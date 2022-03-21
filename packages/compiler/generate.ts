import {
  ARRAYEXPRESSION,
  CALLEXPRESSION,
  FUNCTIONDECL,
  RETURNSTATEMENT,
  STRINGLITERAL
} from './constants'

const generate = node => {
  const context = {
    code: '',
    currentIndent: 0,
    push: code => (context.code += code),
    newline: () => (context.code += `\n${' '.repeat(2 * context.currentIndent)}`),
    indent: () => {
      context.currentIndent += 1
      context.newline()
    },
    deIndent: () => {
      context.currentIndent -= 1
      context.newline()
    }
  }

  generateNode(node, context)

  return context.code
}

const generateNode = (node, context) => {
  switch (node.type) {
    case FUNCTIONDECL:
      generateFunctionDecl(node, context)
      break
    case RETURNSTATEMENT:
      generateReturnStatement(node, context)
      break
    case CALLEXPRESSION:
      generateCallExpression(node, context)
      break
    case STRINGLITERAL:
      generateStringLiteral(node, context)
      break
    case ARRAYEXPRESSION:
      generateArrayExpression(node, context)
      break
  }
}

const generateFunctionDecl = (node, context) => {
  const { push, indent, deIndent } = context

  push(`function ${node.id.name}`)
  push(`(`)
  generateNodeList(node.params, context)
  push(`)`)
  push(`{`)
  indent()
  node.body.forEach(c => generateNode(c, context))
  deIndent()
  push(`}`)
}
const generateReturnStatement = (node, context) => {
  const { push } = context
  push('return ')
  generateNode(node.return, context)
}
const generateCallExpression = (node, context) => {
  const { push } = context
  const { callee, arguments: args } = node
  push(`${callee.name}(`)
  generateNodeList(args, context)
  push(')')
}
const generateStringLiteral = (node, context) => {
  const { push } = context
  push(`'${node.value}'`)
}
const generateArrayExpression = (node, context) => {
  const { push } = context
  push('[')
  generateNodeList(node.elements, context)
  push(']')
}

const generateNodeList = (nodes, context) => {
  const { push } = context
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    generateNode(node, context)
    if (i < nodes.length - 1) push(', ')
  }
}

export default generate
