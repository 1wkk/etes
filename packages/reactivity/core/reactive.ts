/**
 * TODO
 * @param target
 * @returns
 */
const reactive = <T extends Object>(target: T) => {
  return new Proxy(target, {})
}

export default reactive
