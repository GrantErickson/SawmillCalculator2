import { ref, watch } from 'vue'

export const sideOfBlade = ref(localStorage.getItem('sideOfBlade') || 'bottom')
export const maxQuantity = ref(localStorage.getItem('maxQuantity') || '100')
export const moneySymbol = ref(localStorage.getItem('moneySymbol') || '$')
export const moneySymbolLocation = ref(localStorage.getItem('moneySymbolLocation') || 'before')

watch(sideOfBlade, (v) => localStorage.setItem('sideOfBlade', v))
watch(maxQuantity, (v) => localStorage.setItem('maxQuantity', v))
watch(moneySymbol, (v) => localStorage.setItem('moneySymbol', v))
watch(moneySymbolLocation, (v) => localStorage.setItem('moneySymbolLocation', v))
