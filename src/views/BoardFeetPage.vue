<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Board Feet (US)</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="ion-padding">
        <ion-segment :value="woodType" @ionChange="updateWoodType($event.detail.value)">
          <ion-segment-button value="soft">
            <ion-label>Softwood</ion-label>
          </ion-segment-button>
          <ion-segment-button value="hard">
            <ion-label>Hardwood</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <ion-list>
        <ion-item>
          <ion-range
            :label="thicknessText"
            :min="1" :max="48" :step="1"
            :value="thickness"
            :pin="true"
            :pin-formatter="(v: number) => woodType === 'hard' ? v + '/4' : v + '&quot;'"
            @ionInput="updateThickness($event.detail.value)"
          ></ion-range>
        </ion-item>
        <ion-item>
          <ion-range
            label="Nominal Width in inches:"
            :min="1" :max="24" :step="1"
            :value="width"
            :pin="true"
            :pin-formatter="(v: number) => v + '&quot;'"
            @ionInput="updateWidth($event.detail.value)"
          ></ion-range>
        </ion-item>
        <ion-item>
          <ion-range
            label="Length in feet:"
            :min="1" :max="24" :step="1"
            :value="length"
            :pin="true"
            :pin-formatter="(v: number) => v + '\''"
            @ionInput="updateLength($event.detail.value)"
          ></ion-range>
        </ion-item>
        <ion-item>
          <ion-range
            label="Quantity:"
            :min="1" :max="Number(settingsMaxQuantity)" :step="1"
            :value="quantity"
            :pin="true"
            @ionInput="updateQuantity($event.detail.value)"
          ></ion-range>
        </ion-item>
        <ion-item>
          <ion-input
            label="Price per 1000bft:"
            type="number"
            :value="String(pricePer1000)"
            @ionInput="updatePricePer1000($event.detail.value)"
          ></ion-input>
        </ion-item>
      </ion-list>

      <!-- Totals -->
      <ion-list inset>
        <ion-item color="primary" class="totals-bar">
          <ion-label>{{ formatBft2(totalBft) }} Bft</ion-label>
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
              {{ formatBft2(item.totalBft) }} bft
              <span style="float: right;">{{ formatMoney(item.totalPrice) }}</span>
            </h2>
            <p>
              {{ item.thickness }}<span v-if="item.woodType === 'hard'">/4</span>" x {{ item.width }}"
              &nbsp; Length: {{ item.length }}'
              &nbsp; Qty: {{ item.quantity }}
              <span style="float: right;">{{ formatMoney(item.pricePer1000) }}/k</span>
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
          <ion-label>{{ formatBft2(grandTotalBft) }} Bft</ion-label>
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
          <small>&copy; 2019 MicaPeak Solutions</small>
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
  IonRange, IonInput, IonSegment, IonSegmentButton,
  IonButton, IonIcon, IonText
} from '@ionic/vue'
import { addOutline, trashOutline, mailOutline } from 'ionicons/icons'
import { maxQuantity as settingsMaxQuantity, moneySymbol } from '../stores/settings'
import { formatBft2, formatMoney, round } from '../utils/formatting'
import { sendEmail, pdfStyles } from '../utils/email'

const WoodTypes = { Softwood: 'soft', Hardwood: 'hard' }

const width = ref(Number(localStorage.getItem('BfWidth')) || 6)
const thickness = ref(Number(localStorage.getItem('BfThickness')) || 2)
const length = ref(Number(localStorage.getItem('BfLength')) || 16)
const quantity = ref(Number(localStorage.getItem('BfQuantity')) || 1)
const pricePer1000 = ref(Number(localStorage.getItem('BfPricePer1000')) || 1)
const woodType = ref(localStorage.getItem('BfWoodType') || WoodTypes.Softwood)

function updateWidth(v: any) { width.value = Number(v) }
function updateThickness(v: any) { thickness.value = Number(v) }
function updateLength(v: any) { length.value = Number(v) }
function updateQuantity(v: any) { quantity.value = Number(v) }
function updatePricePer1000(v: any) { pricePer1000.value = Number(v) || 0 }
function updateWoodType(v: any) { woodType.value = v }

watch(width, (v) => localStorage.setItem('BfWidth', String(v)))
watch(thickness, (v) => localStorage.setItem('BfThickness', String(v)))
watch(length, (v) => localStorage.setItem('BfLength', String(v)))
watch(quantity, (v) => localStorage.setItem('BfQuantity', String(v)))
watch(pricePer1000, (v) => localStorage.setItem('BfPricePer1000', String(v)))
watch(woodType, (v) => localStorage.setItem('BfWoodType', v))

const thicknessText = computed(() => {
  if (woodType.value == WoodTypes.Hardwood) {
    return 'Thickness in Quarters of inches: ' + thickness.value + '/4'
  }
  return 'Nominal Thickness in inches:'
})

const totalBft = computed(() => {
  var value = Number(width.value) * Number(thickness.value) * Number(length.value) * Number(quantity.value) / 12
  if (woodType.value == WoodTypes.Hardwood) {
    value = value / 4
  }
  return Math.round(value * 100) / 100
})

const totalPrice = computed(() => {
  return Math.round(Number(totalBft.value) * Number(pricePer1000.value) / 1000 * 100) / 100
})

const pieceBft = computed(() => round(totalBft.value / quantity.value, 2))
const piecePrice = computed(() => round(totalPrice.value / quantity.value, 2))

interface LumberItemData {
  width: number; thickness: number; length: number; quantity: number
  pricePer1000: number; totalBft: number; totalPrice: number
  pieceBft: number; piecePrice: number; woodType: string
}

const lumberItems = ref<LumberItemData[]>(
  JSON.parse(localStorage.getItem('LumberItems') || '[]')
)

watch(lumberItems, (v) => {
  localStorage.setItem('LumberItems', JSON.stringify(v))
}, { deep: true })

const grandTotalBft = computed(() => lumberItems.value.reduce((sum, item) => sum + item.totalBft, 0))
const grandTotalPrice = computed(() => lumberItems.value.reduce((sum, item) => sum + item.totalPrice, 0))

function addLumberItem() {
  lumberItems.value.push({
    width: width.value,
    thickness: thickness.value,
    length: length.value,
    quantity: quantity.value,
    pricePer1000: pricePer1000.value,
    totalBft: totalBft.value,
    totalPrice: totalPrice.value,
    pieceBft: pieceBft.value,
    piecePrice: piecePrice.value,
    woodType: woodType.value
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
    '<th>Bft/piece</th>' +
    '<th>Total Bft</th>' +
    '<th>' + moneySymbol.value + '/1000</th>' +
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
      '<td>' + item.thickness + (item.woodType == WoodTypes.Hardwood ? '/4' : '') + '"</td>' +
      '<td>' + item.width + '"</td>' +
      "<td>" + item.length + "'</td>" +
      '<td>' + formatBft2(item.pieceBft) + '</td>' +
      '<td>' + formatBft2(itemTotalBft) + '</td>' +
      '<td>' + formatMoney(round(item.pricePer1000, 2)) + '</td>' +
      '<td>' + formatMoney(round(item.piecePrice, 2)) + '</td>' +
      '<td>' + formatMoney(itemTotalPrice) + '</td></tr>\n'
    totalPriceSum += itemTotalPrice
    totalBftSum += itemTotalBft
  })
  text += '</tbody>\n'

  text += '<tfoot><tr>' +
    '<th></th><th></th><th></th><th></th><th></th><th></th>' +
    '<th>' + formatBft2(totalBftSum) + '</th>' +
    '<th></th><th></th>' +
    '<th>' + formatMoney(totalPriceSum) + '</th>' +
    '</tr></tfoot>\n'
  text += '</table>\n'

  sendEmail(subject, text, 'BoardFeet.pdf')
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
</style>
