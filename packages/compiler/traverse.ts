// must modify context directly, do not replace it with {...context},
// or global context will not be changed
const traverse = (ast, context) => {
  context.currentNode = ast

  const exitFcs = []
  for (const transform of context.transforms) {
    const onExit = transform(context.currentNode, context)
    if (onExit) exitFcs.push(onExit)
    if (!context.currentNode) return
  }

  context.currentNode.children?.forEach((c, i) => {
    context.parent = context.currentNode
    context.childIndex = i
    traverse(c, context)
  })

  exitFcs.reverse().forEach(fc => fc())
}

export default traverse
