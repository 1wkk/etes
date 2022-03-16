export interface Ref<T> {
  value: T
}

export type ToRef<T> = T extends Ref<T> ? T : Ref<T>

export const __v_isRef = '__v_isRef'
