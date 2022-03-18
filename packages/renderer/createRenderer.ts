import cx from 'cx'

interface El extends HTMLElement {
  [key: string]: any
}

interface CreateRendererOptions {
  createElement?: (tag) => void
  setElementText?: (el: HTMLElement | any, text) => void
  insert?: (el: HTMLElement | any, parent: HTMLElement | any, anchor?: any) => void
  createText?: (text: string) => Text
  setText?: (el: El | Text, text: string) => void
  patchProps?: (el: HTMLElement | any, k, pv, v) => void
}

const Text = Symbol('Text')
// @ts-ignore
const Comment = Symbol('Comment')
// document.createComment
const Fragment = Symbol('Fragment')

const createRenderer = (options: CreateRendererOptions = {}) => {
  const {
    createElement = type => document.createElement(type),
    setElementText = (el: HTMLElement, text) => (el.textContent = text),
    insert = (el: HTMLElement, parent: HTMLElement, anchor = null) =>
      parent.insertBefore(el, anchor),
    createText = text => document.createTextNode(text),
    setText = (el, text) => (el.nodeValue = text),
    patchProps = (el: El, k: string, pv, v) => {
      if (/^on/.test(k)) {
        const type = k.slice(2) // or substring
        // `_vei`: vue event invoker(s)
        const invokers = el._vei ?? (el._vei = {})
        let invoker = invokers[k]
        if (v) {
          if (!invoker) {
            invoker = el._vei[k] = (e: Event) => {
              // e.timeStamp is a high-precision time in modern browsers
              // prevent event bubbling and update timing issues
              if (e.timeStamp < invoker.attached) {
                return
              }
              if (Array.isArray(invoker.value)) {
                invoker.value.forEach(fn => fn(e))
              } else {
                invoker.value(e)
              }
            }
            invoker.value = v
            // High precision time
            invoker.attached = performance.now()
            el.addEventListener(type, invoker)
          } else {
            invoker.value = v // only update when invoker is exist
          }
        } else if (invoker) {
          el.removeEventListener(type, invoker)
        }
      } else if (k === 'class') {
        // `cx` should be used in compiler
        el.className = cx(v)
      } else if (shouldSetAsProps(el, k, v)) {
        if (typeof el[k] === 'boolean' && v === '') {
          el[k] = true
        } else {
          el[k] = v
        }
      } else {
        el.setAttribute(k, v)
      }
    }
  } = options

  /**
   * 1. Some props are read-only
   * @param el
   * @param k
   * @param v
   * @returns
   */
  const shouldSetAsProps = (el, k, v) => {
    if (el.tagName === 'INPUT' && k === 'form') {
      return false
    }
    return k in el
  }

  const mountElement = (vnode, container) => {
    const el = (vnode.el = createElement(vnode.type))

    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach(c => patch(null, c, el))
    }

    if (vnode.props) {
      for (const k in vnode.props) {
        patchProps(el, k, null, vnode.props[k])
      }
    }

    insert(el, container)
  }

  /**
   * Find vnode.el.parentElement and remove itself
   * Why `parentElement` is better than `parentNode`?
   * https://stackoverflow.com/questions/8685739/difference-between-dom-parentnode-and-parentelement
   * @param vnode
   * @returns
   */
  const unmount = vnode => {
    if (vnode.type === Fragment) {
      vnode.children.forEach(c => unmount(c))
    } else {
      vnode.el.parentElement?.removeChild(vnode.el)
    }
  }

  /**
   * 1. mount elements
   * 2. unmount elements
   * 3. patch elements
   *  1. dom elements
   *  2. component elements
   * @param n1
   * @param n2
   * @param container
   */
  const patch = (n1, n2, container) => {
    if (n1 && n1.type !== n2.type) {
      unmount(n1)
      n1 = null
    }

    const { type } = n2

    if (typeof type === 'string') {
      // Dom element
      if (!n1) {
        mountElement(n2, container)
      } else {
        patchElement(n1, n2)
      }
    } else if (typeof type === 'object') {
      // Component element
    } else if (type === Text) {
      if (!n1) {
        const el = (n2.el = createText(n2.children))
        insert(el, container)
      } else {
        const el = (n2.el = n1.el)
        if (n2.children !== n1.children) {
          setText(el, n2.children)
        }
      }
    } else if (type === Fragment) {
      if (!n1) {
        // skip n2 self, render its children to n2's container
        n2.children.forEach(c => patch(null, c, container))
      } else {
        patchChildren(n1, n2, container)
      }
    }
  }

  const patchElement = (n1, n2) => {
    const el = (n2.el = n1.el)
    const p1 = n1.props
    const p2 = n2.props

    for (const k in p2) {
      if (p2[k] !== p1[k]) {
        patchProps(el, k, p1[k], p2[k])
      }
    }
    for (const k in p1) {
      if (!(k in p2)) {
        patchProps(el, k, p1[k], null)
      }
    }

    patchChildren(n1, n2, el)
  }

  const patchChildren = (n1, n2, el) => {
    if (typeof n2.children === 'string') {
      if (Array.isArray(n1.children)) {
        n1.children.forEach(c => unmount(c))
      }
      setElementText(el, n2.children)
    } else if (Array.isArray(n2.children)) {
      if (Array.isArray(n1.children)) {
        // diff
        n1.children.forEach(c => unmount(c))
        n2.children.forEach(c => patch(null, c, el))
      } else {
        setElementText(el, '')
        n2.children.forEach(c => patch(null, c, el))
      }
    } else {
      if (Array.isArray(n1.children)) {
        n1.children.forEach(c => unmount(c))
      } else if (typeof n1.children === 'string') {
        setElementText(el, '')
      }
    }
  }

  const render = (vnode, container): any => {
    if (vnode) {
      patch(container._vnode, vnode, container)
    } else if (container._vnode) {
      unmount(container._vnode)
    }

    container._vnode = vnode
  }

  return {
    render
  }
}

export default createRenderer
