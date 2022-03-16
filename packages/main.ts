import './style.css'

import {
  effect,
  ITERATE_KEY,
  track,
  trigger,
  TriggerType
} from './reactivity/core/reactivity'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`

const data = { ok: false, text: 'hello world', deep: { deeper: 'deeper' }, cnt: 0 }
const obj = new Proxy(data, {
  get(target, key, receiver) {
    track(target, key)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, v, receiver) {
    const type = Object.prototype.hasOwnProperty.call(target, key)
      ? TriggerType.SET
      : TriggerType.ADD
    const res = Reflect.set(target, key, v, receiver)
    trigger(target, key, type)
    return res
  },
  ownKeys(target) {
    track(target, ITERATE_KEY)
    return Reflect.ownKeys(target)
  },
  deleteProperty(target, key) {
    const hadKey = Object.prototype.hasOwnProperty.call(target, key)
    const res = Reflect.deleteProperty(target, key)
    if (hadKey && res) {
      trigger(target, key, TriggerType.DELETE)
    }
    return res
  }
})

// From this, key will not be like 'deep.deeper', it just like 'deep'
// const Test = obj.deep.deeper

effect(() => (app.innerHTML = obj.ok ? obj.text : 'not'))

setTimeout(() => {
  obj.ok = true
}, 2000)

setTimeout(() => {
  obj.text = '@vue/reactivity'
}, 5000)

effect(() => (obj.cnt = obj.cnt + 1))
