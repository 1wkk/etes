import { __v_isRef } from '../types'
import reactive from './reactive'

/**
 * To get proxy of original value
 * @param value
 * @returns Proxy value
 */
const ref = <T>(value: T) => {
  const wrapper = {
    value
  }

  // `__v_isRef` is not enumerable and writable by default
  // use to distinguish original object and proxy object
  Object.defineProperty(wrapper, __v_isRef, {
    value: true
  })

  return reactive(wrapper)
}

export default ref
