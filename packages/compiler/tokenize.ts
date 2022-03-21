import { TAG, TAGEND, TEXT } from './constants'

const enum State {
  Initial,
  TagOpen,
  TagName,
  Text,
  TagEnd,
  TagEndName
}

const isAplha = (c: string) => /[a-zA-z]/.test(c)

const tokenize = (str: string) => {
  let currentState = State.Initial
  const chars = []
  const tokens = []
  while (str) {
    const c = str[0]
    switch (currentState) {
      case State.Initial:
        if (c === '<') {
          currentState = State.TagOpen
          str = str.slice(1)
        } else if (isAplha(c)) {
          currentState = State.Text
          chars.push(c)
          str = str.slice(1)
        }
        break
      case State.TagOpen:
        if (isAplha(c)) {
          currentState = State.TagName
          chars.push(c)
          str = str.slice(1)
        } else if (c === '/') {
          currentState = State.TagEnd
          str = str.slice(1)
        }
        break
      case State.TagName:
        if (isAplha(c)) {
          chars.push(c)
          str = str.slice(1)
        } else if (c === '>') {
          currentState = State.Initial
          tokens.push({
            type: TAG,
            name: chars.join('')
          })
          chars.length = 0
          str = str.slice(1)
        }
        break
      case State.Text:
        if (isAplha(c)) {
          chars.push(c)
          str = str.slice(1)
        } else if (c === '<') {
          currentState = State.TagOpen
          tokens.push({
            type: TEXT,
            content: chars.join('')
          })
          chars.length = 0
          str = str.slice(1)
        }
        break
      case State.TagEnd:
        if (isAplha(c)) {
          currentState = State.TagEndName
          chars.push(c)
          str = str.slice(1)
        }
        break
      case State.TagEndName:
        if (isAplha(c)) {
          chars.push(c)
          str = str.slice(1)
        } else if (c === '>') {
          currentState = State.Initial
          tokens.push({
            type: TAGEND,
            name: chars.join('')
          })
          chars.length = 0
          str = str.slice(1)
        }
        break
      default:
        console.log('unknow state')
        break
    }
  }
  return tokens
}

export default tokenize
