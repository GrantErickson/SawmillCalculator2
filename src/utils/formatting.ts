import { moneySymbol, moneySymbolLocation } from '../stores/settings'

export function formatNumber(n: number, c: number = 2, d: string = '.', t: string = ','): string {
  var prec = isNaN(c = Math.abs(c)) ? 2 : c
  var dec = d == undefined ? '.' : d
  var thou = t == undefined ? ',' : t
  var s = n < 0 ? '-' : ''
  var i = parseInt(String(Math.abs(+n || 0).toFixed(prec))) + ''
  var j = i.length > 3 ? i.length % 3 : 0
  return s + (j ? i.substr(0, j) + thou : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thou) + (prec ? dec + Math.abs(n - Number(i)).toFixed(prec).slice(2) : '')
}

export function formatMoney(n: number, c?: number, d?: string, t?: string): string {
  var formatted = formatNumber(n, c, d, t)
  if (moneySymbolLocation.value === 'before') {
    return moneySymbol.value + formatted
  }
  return formatted + moneySymbol.value
}

export function formatBft(n: number): string {
  return formatNumber(n, 0, '.', ',')
}

export function formatBft2(n: number): string {
  return formatNumber(n, 2, '.', ',')
}

export function formatM3(n: number, places: number = 4): string {
  return formatNumber(n, places, '.', ',')
}

export function round(num: number, places: number): number {
  return Math.round(num * Math.pow(10, places)) / Math.pow(10, places)
}
