/**
 * a easy function to scan object
 * @param value
 * @param seen
 * @returns
 */
const traverse = (value, seen = new Set()) => {
  if (typeof value !== 'object' || value === null || seen.has(value)) return

  seen.add(value)

  for (const k in value) {
    traverse(value[k], seen)
  }

  return value
}

export default traverse
