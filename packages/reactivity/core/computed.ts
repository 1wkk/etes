import { effect, track, trigger } from './reactivity'

const computed = getter => {
  // Cache
  let value
  let dirty = true

  const effectFn = effect(getter, {
    lazy: true,
    scheduler: () => {
      if (!dirty) {
        dirty = true
        trigger(obj, 'value')
      }
    }
  })

  const obj = {
    get value() {
      if (dirty) {
        dirty = false
        value = effectFn()
      }
      track(obj, 'value')
      return value
    }
  }

  return obj
}

export default computed
