import proxyRefs from './utils/proxyRefs'

const setup = (fc: Function) => proxyRefs(fc())

export default setup
