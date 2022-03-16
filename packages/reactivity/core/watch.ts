import { traverse } from '../utils'
import { effect } from './reactivity'

/**
 * use scheduler to realize callback func, use lazy to get `oldValue` and `newValue`
 * use `onInvalidate` and `cleanup` to solve race hazard
 * @param source function or object
 * @param cb callback(newValue, oldValue, onInvalidate) => {}
 * @param options immediate, flush = 'pre' | 'post'(after DOM) | 'sync'(default)
 */
const watch = (
  source,
  cb,
  options = {
    immediate: false,
    flush: 'sync'
  }
) => {
  let getter
  if (typeof source === 'function') getter = source
  else getter = () => traverse(source)

  let oldValue, newValue
  const job = () => {
    newValue = effectFn()
    if (cleanup) cleanup()
    cb(newValue, oldValue, onInvalidate)
    oldValue = newValue
  }

  let cleanup
  const onInvalidate = fn => (cleanup = fn)

  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler: () => {
      if (options.flush === 'post') {
        const p = Promise.resolve()
        p.then(job)
      } else job()
    }
  })

  if (options.immediate) job()
  else oldValue = effectFn()
}

export default watch
