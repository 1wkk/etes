import isRef from '../utilities/isRef'
import unRef from '../utilities/unRef'

/**
 * 自动脱 ref
 * @param r
 * @returns
 */
const proxyRefs = r =>
  new Proxy(r, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)
      return unRef(value)
    },
    set(target, key, value, receiver) {
      const v = target[key]
      if (isRef(v)) {
        v.value = value
        return true
      }
      return Reflect.set(target, key, value, receiver)
    }
  })

export default proxyRefs
