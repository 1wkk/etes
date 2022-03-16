import { ToRef } from '../types'
import proxyRefs from '../utils/proxyRefs'
import toRef from './toRef'

const toRefs = <T extends Object>(object: T): { [K in keyof T]: ToRef<T[K]> } => {
  // return Object.keys(object).reduce((r, key) => (r[key] = toRef(object, key)), {})
  const ret = {}
  // @ts-ignore
  for (const key of object) ret[key] = toRef(object, key)
  // @ts-ignore
  return proxyRefs(ret)
}

export default toRefs
