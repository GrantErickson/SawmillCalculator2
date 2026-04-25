import { ref, watch } from 'vue'
import { defaultWoodSpeciesList } from '../utils/species'

export const sideOfBlade = ref(localStorage.getItem('sideOfBlade') || 'bottom')
export const maxQuantity = ref(localStorage.getItem('maxQuantity') || '100')
export const moneySymbol = ref(localStorage.getItem('moneySymbol') || '$')
export const moneySymbolLocation = ref(localStorage.getItem('moneySymbolLocation') || 'before')

function loadSpeciesList(): string[] {
  const stored = localStorage.getItem('woodSpeciesList')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch { /* fall through to default */ }
  }
  return [...defaultWoodSpeciesList]
}

export const woodSpeciesList = ref<string[]>(loadSpeciesList())

export function addSpecies(name: string): boolean {
  const trimmed = name.trim()
  if (!trimmed) return false
  if (woodSpeciesList.value.some(s => s.toLowerCase() === trimmed.toLowerCase())) return false
  woodSpeciesList.value.push(trimmed)
  return true
}

export function removeSpecies(index: number) {
  woodSpeciesList.value.splice(index, 1)
}

export function resetSpeciesToDefault() {
  woodSpeciesList.value = [...defaultWoodSpeciesList]
}

watch(sideOfBlade, (v) => localStorage.setItem('sideOfBlade', v))
watch(maxQuantity, (v) => localStorage.setItem('maxQuantity', v))
watch(moneySymbol, (v) => localStorage.setItem('moneySymbol', v))
watch(moneySymbolLocation, (v) => localStorage.setItem('moneySymbolLocation', v))
watch(woodSpeciesList, (v) => localStorage.setItem('woodSpeciesList', JSON.stringify(v)), { deep: true })
