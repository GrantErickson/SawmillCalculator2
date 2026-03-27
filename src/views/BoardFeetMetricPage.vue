<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Board Feet (Metric)</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item lines="none">
          <ion-range
            label="Thickness in mm:"
            label-placement="stacked"
            :min="5" :max="400" :step="5"
            :value="thickness"
            :pin="true"
            :pin-formatter="(v: number) => v + 'mm'"
            @ionInput="updateThickness($event.detail.value)"
          >
            <ion-input slot="end" type="number" class="range-value-input"
              :value="String(thickness)"
              @ionInput="updateThickness($event.detail.value)"
            ></ion-input>
          </ion-range>
        </ion-item>
        <ion-item lines="none">
          <ion-range
            label="Width in mm:"
            label-placement="stacked"
            :min="5" :max="400" :step="5"
            :value="width"
            :pin="true"
            :pin-formatter="(v: number) => v + 'mm'"
            @ionInput="updateWidth($event.detail.value)"
          >
            <ion-input slot="end" type="number" class="range-value-input"
              :value="String(width)"
              @ionInput="updateWidth($event.detail.value)"
            ></ion-input>
          </ion-range>
        </ion-item>
        <ion-item lines="none">
          <ion-range
            label="Length in mm:"
            label-placement="stacked"
            :min="100" :max="10000" :step="100"
            :value="length"
            :pin="true"
            :pin-formatter="(v: number) => v + 'mm'"
            @ionInput="updateLength($event.detail.value)"
          >
            <ion-input slot="end" type="number" class="range-value-input"
              :value="String(length)"
              @ionInput="updateLength($event.detail.value)"
            ></ion-input>
          </ion-range>
        </ion-item>
        <ion-item lines="none">
          <ion-range
            label="Quantity:"
            label-placement="stacked"
            :min="1" :max="Number(settingsMaxQuantity)" :step="1"
            :value="quantity"
            :pin="true"
            @ionInput="updateQuantity($event.detail.value)"
          >
            <ion-input slot="end" type="number" class="range-value-input"
              :value="String(quantity)"
              @ionInput="updateQuantity($event.detail.value)"
            ></ion-input>
          </ion-range>
        </ion-item>
        <ion-item>
          <ion-input
            label="Price per cubic meter:"
            :value="priceEditing ? priceEditValue : formatMoney(pricePerMeter3)"
            @ionFocus="onPriceFocus"
            @ionBlur="onPriceBlur"
            @ionInput="updatePriceRaw($event.detail.value)"
          ></ion-input>
        </ion-item>
      </ion-list>

      <!-- Totals -->
      <ion-list inset>
        <ion-item color="primary" class="totals-bar">
          <ion-label>{{ formatM3(totalM3) }} m³</ion-label>
          <ion-label class="ion-text-center">Totals</ion-label>
          <ion-label slot="end" class="totals-end">{{ formatMoney(totalPrice) }}</ion-label>
        </ion-item>
      </ion-list>

      <div class="ion-padding">
        <ion-button expand="block" @click="addLumberItem">
          <ion-icon :icon="addOutline" slot="start"></ion-icon>
          Add to List ({{ lumberItems.length }})
        </ion-button>
      </div>

      <!-- Lumber List -->
      <h3 class="ion-padding-horizontal" style="margin-bottom: 0;">Lumber List</h3>
      <ion-list inset>
        <ion-item v-for="(item, idx) in lumberItems" :key="idx">
          <ion-label>
            <h2>
              <strong>{{ idx + 1 }}.</strong>
              {{ formatM3(item.totalBft) }} m³
              <span style="float: right;">{{ formatMoney(item.totalPrice) }}</span>
            </h2>
            <p>
              {{ item.thickness }}x{{ item.width }}x{{ item.length }}
              &nbsp; x{{ item.quantity }}
              <span style="float: right;">{{ formatMoney(item.pricePerMeter3) }}/m³</span>
            </p>
          </ion-label>
          <ion-button slot="end" fill="clear" color="danger" @click="deleteItem(idx)">
            <ion-icon :icon="trashOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>

      <!-- Grand Totals -->
      <ion-list inset>
        <ion-item color="primary" class="totals-bar">
          <ion-label>{{ formatM3(grandTotalM3) }} m³</ion-label>
          <ion-label class="ion-text-center">Lumber Totals</ion-label>
          <ion-label slot="end" class="totals-end">{{ formatMoney(grandTotalPrice) }}</ion-label>
        </ion-item>
      </ion-list>

      <div class="ion-padding">
        <ion-button expand="block" @click="onSendEmail">
          <ion-icon :icon="mailOutline" slot="start"></ion-icon>
          Send Email
        </ion-button>
        <ion-button expand="block" color="danger" @click="clearLumberItems">
          <ion-icon :icon="trashOutline" slot="start"></ion-icon>
          Clear List
        </ion-button>
      </div>

      <div class="ion-text-center ion-padding">
        <ion-text color="medium">
          <small>&copy; 2020 MicaPeak Solutions</small>
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonList, IonItem, IonLabel,
  IonRange, IonInput, IonButton, IonIcon, IonText
} from '@ionic/vue'
import { addOutline, trashOutline, mailOutline } from 'ionicons/icons'
import { maxQuantity as settingsMaxQuantity, moneySymbol } from '../stores/settings'
import { formatM3, formatMoney, round } from '../utils/formatting'
import { sendEmail, pdfStyles } from '../utils/email'

const width = ref(Number(localStorage.getItem('BfWidthMetric')) || 100)
const thickness = ref(Number(localStorage.getItem('BfThicknessMetric')) || 50)
const length = ref(Number(localStorage.getItem('BfLengthMetric')) || 3000)
const quantity = ref(Number(localStorage.getItem('BfQuantityMetric')) || 1)
const pricePerMeter3 = ref(Number(localStorage.getItem('BfPricePerMetric')) || 1)

function updateWidth(v: any) { width.value = clamp(Number(v), 5, 400) }
function updateThickness(v: any) { thickness.value = clamp(Number(v), 5, 400) }
function updateLength(v: any) { length.value = clamp(Number(v), 100, 10000) }
function updateQuantity(v: any) { quantity.value = clamp(Number(v), 1, Number(settingsMaxQuantity.value)) }
function updatePrice(v: any) { pricePerMeter3.value = Number(v) || 0 }

function clamp(value: number, min: number, max: number): number {
  if (isNaN(value)) return min
  return Math.min(Math.max(value, min), max)
}

const priceEditing = ref(false)
const priceEditValue = ref('')

function onPriceFocus() {
  priceEditing.value = true
  priceEditValue.value = String(pricePerMeter3.value)
}

function onPriceBlur() {
  priceEditing.value = false
  pricePerMeter3.value = Number(priceEditValue.value) || 0
}

function updatePriceRaw(v: any) {
  priceEditValue.value = String(v)
  pricePerMeter3.value = Number(v) || 0
}

watch(width, (v) => localStorage.setItem('BfWidthMetric', String(v)))
watch(thickness, (v) => localStorage.setItem('BfThicknessMetric', String(v)))
watch(length, (v) => localStorage.setItem('BfLengthMetric', String(v)))
watch(quantity, (v) => localStorage.setItem('BfQuantityMetric', String(v)))
watch(pricePerMeter3, (v) => localStorage.setItem('BfPricePerMetric', String(v)))

const totalM3 = computed(() => {
  var value = Number(width.value) * Number(thickness.value) * Number(length.value) * Number(quantity.value)
  return Math.round(value / 100) / 10000000
})

const totalPrice = computed(() => {
  return Math.round(Number(totalM3.value) * Number(pricePerMeter3.value) * 100) / 100
})

const pieceM3 = computed(() => round(totalM3.value / quantity.value, 5))
const piecePrice = computed(() => round(totalPrice.value / quantity.value, 2))

interface LumberItemMetricData {
  width: number; thickness: number; length: number; quantity: number
  pricePerMeter3: number; totalBft: number; totalPrice: number
  pieceBft: number; piecePrice: number
}

const lumberItems = ref<LumberItemMetricData[]>(
  JSON.parse(localStorage.getItem('LumberItemsMetric') || '[]')
)

watch(lumberItems, (v) => {
  localStorage.setItem('LumberItemsMetric', JSON.stringify(v))
}, { deep: true })

const grandTotalM3 = computed(() => lumberItems.value.reduce((sum, item) => sum + item.totalBft, 0))
const grandTotalPrice = computed(() => lumberItems.value.reduce((sum, item) => sum + item.totalPrice, 0))

function addLumberItem() {
  lumberItems.value.push({
    width: width.value,
    thickness: thickness.value,
    length: length.value,
    quantity: quantity.value,
    pricePerMeter3: pricePerMeter3.value,
    totalBft: totalM3.value,
    totalPrice: totalPrice.value,
    pieceBft: pieceM3.value,
    piecePrice: piecePrice.value
  })
}

function deleteItem(index: number) {
  lumberItems.value.splice(index, 1)
}

function clearLumberItems() {
  if (confirm('Do you really want to clear the list?')) {
    lumberItems.value = []
  }
}

function onSendEmail() {
  var subject = 'Lumber List'
  var text = pdfStyles + '\n<table>'
  text += '<thead><tr>' +
    '<th class="left">#</th>' +
    '<th>Quantity</th>' +
    '<th>Thickness</th>' +
    '<th>Width</th>' +
    '<th>Length</th>' +
    '<th>m&#179;/piece</th>' +
    '<th>Total m&#179;</th>' +
    '<th>' + moneySymbol.value + '/m&#179;</th>' +
    '<th>' + moneySymbol.value + '/piece</th>' +
    '<th>Total</th></tr></thead>\n'

  text += '<tbody>\n'
  var totalBftSum = 0
  var totalPriceSum = 0
  lumberItems.value.forEach((item, idx) => {
    var itemTotalPrice = round(item.totalPrice, 2)
    var itemTotalBft = round(item.totalBft, 2)
    text += '<tr>' +
      '<td class="left">' + (idx + 1) + '</td>' +
      '<td>' + item.quantity + '</td>' +
      '<td>' + item.thickness + ' mm</td>' +
      '<td>' + item.width + ' mm</td>' +
      '<td>' + item.length + ' mm</td>' +
      '<td>' + formatM3(item.pieceBft) + '</td>' +
      '<td>' + formatM3(itemTotalBft) + '</td>' +
      '<td>' + formatMoney(round(item.pricePerMeter3, 5)) + '</td>' +
      '<td>' + formatMoney(round(item.piecePrice, 2)) + '</td>' +
      '<td>' + formatMoney(itemTotalPrice) + '</td></tr>\n'
    totalPriceSum += itemTotalPrice
    totalBftSum += itemTotalBft
  })
  text += '</tbody>\n'

  text += '<tfoot><tr>' +
    '<th></th><th></th><th></th><th></th><th></th><th></th>' +
    '<th>' + formatM3(totalBftSum) + ' m&#179;</th>' +
    '<th></th><th></th>' +
    '<th>' + formatMoney(totalPriceSum) + '</th>' +
    '</tr></tfoot>\n'
  text += '</table>\n'

  sendEmail(subject, text, 'Lumber.pdf')
}
</script>

<style scoped>
.totals-bar ion-label {
  font-size: 1rem;
  font-weight: 600;
}
.totals-end {
  text-align: right;
}
.range-value-input {
  max-width: 70px;
  text-align: right;
}
ion-range {
  --label-font-size: 1.1rem;
}
ion-range::part(label) {
  margin-bottom: 2px;
}
</style>
