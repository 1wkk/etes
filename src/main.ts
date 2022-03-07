import './style.css'

import { effect, track, trigger } from './reactivity'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`

const data = { ok: false, text: 'hello world', deep: { deeper: 'deeper' }, cnt: 0 }

const obj = new Proxy(data, {
  get(target, key) {
    track(target, key)
    return target[key]
  },
  set(target, key, v) {
    target[key] = v
    trigger(target, key)
    return true
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
