import { useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch { return initialValue }
  })
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const v = value instanceof Function ? value(storedValue) : value
      setStoredValue(v)
      window.localStorage.setItem(key, JSON.stringify(v))
    } catch (e) { console.error(e) }
  }
  return [storedValue, setValue] as const
}
