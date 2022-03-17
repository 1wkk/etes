interface ClassArray extends Array<ClassValue> {}
interface ClassDictionary {
  [id: string]: any
}
type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined

const toVal = mix => {
  let k,
    y,
    str = ''

  if (typeof mix === 'string' || typeof mix === 'number') {
    str += mix
  } else if (typeof mix === 'object') {
    if (Array.isArray(mix)) {
      const len = mix.length
      for (let k = 0; k < len; k++) {
        if (mix[k]) {
          if ((y = toVal(mix[k]))) {
            str && (str += ' ')
            str += y
          }
        }
      }
    } else {
      for (k in mix) {
        if (mix[k]) {
          str && (str += ' ')
          str += k
        }
      }
    }
  }

  return str
}

export default function (...classes: ClassValue[]): string {
  let i = 0,
    tmp,
    x,
    str = ''
  const len = classes.length
  for (; i < len; i++) {
    if ((tmp = classes[i])) {
      if ((x = toVal(tmp))) {
        str && (str += ' ')
        str += x
      }
    }
  }
  return str
}
