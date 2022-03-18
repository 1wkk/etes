import { effect, ref } from '@vue/reactivity'
import createRenderer from './renderer/createRenderer'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

const v = ref<number>(1)
const renderer = createRenderer()

effect(() => {
  const vnode = {
    type: 'div',
    props: {
      onclick: () => v.value++
    },
    children: `${v.value}`
  }

  renderer.render(vnode, app)
})
