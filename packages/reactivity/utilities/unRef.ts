import isRef from './isRef'

/**
 * A sugar function for `val = isRef(val) ? val.value : val`
 * @param r
 * @returns
 */
const unRef = r => (isRef(r) ? r.value : r)

export default unRef
