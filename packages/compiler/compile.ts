import parse from './parse'
import transform from './transform'
import generate from './generate'

const compile = template => {
  const ast = parse(template)
  transform(ast)
  return generate(ast.jsNode)
}

export default compile
