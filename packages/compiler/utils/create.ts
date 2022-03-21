import {
  ARRAYEXPRESSION,
  CALLEXPRESSION,
  IDENTIFIER,
  STRINGLITERAL
} from '../constants'

export const createStringLiteral = value => ({
  type: STRINGLITERAL,
  value
})

export const createIdentifier = name => ({
  type: IDENTIFIER,
  name
})

export const createArrayExpression = elements => ({
  type: ARRAYEXPRESSION,
  elements
})

export const createCallExpression = (callee, args) => ({
  type: CALLEXPRESSION,
  callee: createIdentifier(callee),
  arguments: args
})
