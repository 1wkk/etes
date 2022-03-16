import { Ref, __v_isRef } from '../types'

const toRef = <T extends Object, K extends keyof T>(
  object: T,
  key: K,
  defaultValue?: T[K]
): Ref<T[K]> => {
  const wrapper = {
    get value() {
      return object[key] ?? defaultValue
    },
    // should writable
    set value(value) {
      object[key] = value
    }
  }

  Object.defineProperty(wrapper, __v_isRef, { value: true })

  return wrapper
}

export default toRef
