export const TriggerType = {
  SET: 'SET',
  ADD: 'ADD',
  DELETE: 'DELETE'
}

export const ITERATE_KEY = Symbol()

let activeEffect
// For nesting
const effectStack = []
const bucket = new WeakMap()

const cleanup = effectFn => {
  effectFn.deps.forEach(dep => dep.delete(effectFn))
  effectFn.deps.length = 0
}

export const effect = (
  fn,
  options = {
    scheduler: () => {},
    lazy: false
  }
) => {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)

    const res = fn()

    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]

    return res
  }
  effectFn.options = options
  effectFn.deps = []

  if (!options.lazy) effectFn()

  // always return
  return effectFn
}

export const track = (target, key) => {
  if (!activeEffect) return

  let devsMap = bucket.get(target)
  if (!devsMap) bucket.set(target, (devsMap = new Map()))

  let deps = devsMap.get(key)
  if (!deps) devsMap.set(key, (deps = new Set()))

  deps.add(activeEffect)

  activeEffect.deps.push(deps)
}

export const trigger = (target, key, type = TriggerType.SET) => {
  const depsMap = bucket.get(target)
  if (!depsMap) return

  const effects = depsMap.get(key)
  // `<any>` for avoid unknown, if unknown, should use `as xxx`, it is troublesome
  const effectsToRun = new Set<any>()
  // data.foo = data.foo + 1, both track and trigger, avoid endless loop
  // trigger will be trigged only for set, activeEffect be set only for get, both only for case above
  // hard to think, retry more times to learn
  effects &&
    effects.forEach(effectFn => {
      if (effectFn !== activeEffect) effectsToRun.add(effectFn)
    })

  if (type === TriggerType.ADD || type === TriggerType.DELETE) {
    const iterateEffects = depsMap.get(ITERATE_KEY)
    iterateEffects &&
      iterateEffects.forEach(effectFn => {
        if (effectFn !== activeEffect) effectsToRun.add(effectFn)
      })
  }

  effectsToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}

const missions = new Set<any>()
const p = Promise.resolve()

let isFlushing = false

/**
 * slove multiple consecutive problems
 * @returns
 */
export const flushMission = () => {
  if (isFlushing) return

  isFlushing = true

  p.then(() => missions.forEach(mission => mission())).finally(
    () => (isFlushing = false)
  )
}
