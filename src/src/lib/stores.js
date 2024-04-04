import { persisted } from 'svelte-persisted-store'
import { writable } from 'svelte/store'

// First param `preferences` is the local storage key.
// Second param is the initial value.
export const nakshatram = persisted('nakshatram', '')
export const location = persisted('location', '')
export const date = writable(new Date())
export const tarabalam_data = writable({})
export const date_dropdown_open = writable(false)