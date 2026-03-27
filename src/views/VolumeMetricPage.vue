<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Volume (Metric)</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item lines="none">
          <ion-range
            label="Diameter in mm:"
            label-placement="stacked"
            :min="100" :max="1000" :step="10"
            :value="diameter"
            :pin="true"
            :pin-formatter="(v: number) => v + 'mm'"
            @ionInput="updateDiameter($event.detail.value)"
          >
            <ion-input slot="end" type="number" class="range-value-input"
              :value="String(diameter)"
              @ionInput="updateDiameter($event.detail.value)"
            ></ion-input>
          </ion-range>
        </ion-item>
        <ion-item lines="none">
          <ion-range
            label="Length in meters:"
            label-placement="stacked"
            :min="1" :max="15" :step="0.1"
            :value="length"
            :pin="true"
            :pin-formatter="(v: number) => v + 'm'"
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
            :min="1" :max="100" :step="1"
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
      </ion-list>

      <!-- Calculations -->
      <ion-list inset>
        <ion-list-header>
          <ion-label>Calculations</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-label>Doyle</ion-label>
          <ion-note slot="end">{{ formatM3(doyle, 3) }} m³</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Scribner</ion-label>
          <ion-note slot="end">{{ formatM3(scribner, 3) }} m³</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>International</ion-label>
          <ion-note slot="end">{{ formatM3(international, 3) }} m³</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>ROY</ion-label>
          <ion-note slot="end">{{ formatM3(roy, 3) }} m³</ion-note>
        </ion-item>
      </ion-list>

      <div class="ion-padding">
        <ion-button expand="block" @click="addItem">
          <ion-icon :icon="addOutline" slot="start"></ion-icon>
          Add to List ({{ items.length }})
        </ion-button>
      </div>

      <!-- Volume List -->
      <h3 class="ion-padding-horizontal" style="margin-bottom: 0;">Volume List</h3>
      <ion-list inset>
        <ion-item v-for="(item, idx) in items" :key="idx">
          <ion-label>
            <h2>
              <strong>{{ idx + 1 }}.</strong>
              D:{{ formatM3(item.doyle, 3) }}
              S:{{ formatM3(item.scribner, 3) }}
              I:{{ formatM3(item.international, 3) }}
              R:{{ formatM3(item.roy, 3) }}
            </h2>
            <p>
              {{ item.diameter }} mm x {{ item.length }} m
              &nbsp; Qty: {{ item.quantity }}
            </p>
          </ion-label>
          <ion-button slot="end" fill="clear" color="danger" @click="deleteItem(idx)">
            <ion-icon :icon="trashOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>

      <!-- Totals -->
      <ion-list inset>
        <ion-list-header>
          <ion-label>Totals</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-label>Doyle</ion-label>
          <ion-note slot="end">{{ formatM3(grandTotalDoyle, 3) }} m³</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Scribner</ion-label>
          <ion-note slot="end">{{ formatM3(grandTotalScribner, 3) }} m³</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>International</ion-label>
          <ion-note slot="end">{{ formatM3(grandTotalInternational, 3) }} m³</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>ROY</ion-label>
          <ion-note slot="end">{{ formatM3(grandTotalRoy, 3) }} m³</ion-note>
        </ion-item>
      </ion-list>

      <div class="ion-padding">
        <ion-button expand="block" @click="onSendEmail">
          <ion-icon :icon="mailOutline" slot="start"></ion-icon>
          Send Email
        </ion-button>
        <ion-button expand="block" color="danger" @click="clearItems">
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
  IonButtons, IonBackButton, IonList, IonListHeader, IonItem, IonLabel,
  IonRange, IonInput, IonButton, IonIcon, IonNote, IonText
} from '@ionic/vue'
import { addOutline, trashOutline, mailOutline } from 'ionicons/icons'
import { formatM3 } from '../utils/formatting'
import { sendEmail, pdfStyles } from '../utils/email'
import { round } from '../utils/formatting'

const mmPerIn = 25.4
const mPerFt = 0.3048
const m3PerBft = 0.00235974

const length = ref(Number(localStorage.getItem('VolumeMetricLength')) || 4)
const diameter = ref(Number(localStorage.getItem('VolumeMetricDiameter')) || 300)
const quantity = ref(Number(localStorage.getItem('VolumeMetricQuantity')) || 1)

function updateLength(v: any) { length.value = clamp(Number(v), 1, 15) }
function updateDiameter(v: any) { diameter.value = clamp(Number(v), 100, 1000) }
function updateQuantity(v: any) { quantity.value = clamp(Number(v), 1, 100) }

function clamp(value: number, min: number, max: number): number {
  if (isNaN(value)) return min
  return Math.min(Math.max(value, min), max)
}

watch(length, (v) => localStorage.setItem('VolumeMetricLength', String(v)))
watch(diameter, (v) => localStorage.setItem('VolumeMetricDiameter', String(v)))
watch(quantity, (v) => localStorage.setItem('VolumeMetricQuantity', String(v)))

const doyle = computed(() => {
  var l = Number(length.value) / mPerFt
  var d = Number(diameter.value) / mmPerIn
  var q = Number(quantity.value)
  var value = (d - 4) * (d - 4) * (l / 16)
  return round(value * q * m3PerBft, 3)
})

const scribner = computed(() => {
  var l = Number(length.value) / mPerFt
  var d = Number(diameter.value) / mmPerIn
  var q = Number(quantity.value)
  var value = (.79 * d * d - 2 * d - 4) * l / 16
  return round(value * q * m3PerBft, 3)
})

const international = computed(() => {
  var l = Number(length.value) / mPerFt
  var d = Number(diameter.value) / mmPerIn
  var q = Number(quantity.value)
  var value = 0.04976191 * l * d * d +
    0.006220239 * l * l * d -
    0.1854762 * l * d +
    0.0002591767 * l * l * l -
    0.01159226 * l * l +
    0.04222222 * l
  return round(value * q * m3PerBft, 3)
})

const roy = computed(() => {
  var l = Number(length.value) / mPerFt
  var d = Number(diameter.value) / mmPerIn
  var q = Number(quantity.value)
  var value = (d - 1) * (d - 1) * 0.5 * l / 10
  return round(value * q * m3PerBft, 3)
})

interface VolumeMetricItemData {
  diameter: number; length: number; quantity: number
  doyle: number; scribner: number; international: number; roy: number
}

const items = ref<VolumeMetricItemData[]>(
  JSON.parse(localStorage.getItem('VolumeMetricItems') || '[]')
)

watch(items, (v) => {
  localStorage.setItem('VolumeMetricItems', JSON.stringify(v))
}, { deep: true })

const grandTotalDoyle = computed(() => items.value.reduce((sum, item) => sum + item.doyle, 0))
const grandTotalScribner = computed(() => items.value.reduce((sum, item) => sum + item.scribner, 0))
const grandTotalInternational = computed(() => items.value.reduce((sum, item) => sum + item.international, 0))
const grandTotalRoy = computed(() => items.value.reduce((sum, item) => sum + item.roy, 0))

function addItem() {
  items.value.push({
    diameter: diameter.value, length: length.value, quantity: quantity.value,
    doyle: doyle.value, scribner: scribner.value,
    international: international.value, roy: roy.value
  })
}

function deleteItem(index: number) {
  items.value.splice(index, 1)
}

function clearItems() {
  if (confirm('Do you really want to clear the list?')) {
    items.value = []
  }
}

function onSendEmail() {
  var subject = 'Log Volume List'
  var text = pdfStyles + '<table>\n'
  text += '<thead>\n<tr>' +
    '<th class="left">#</th>' +
    '<th>Quantity</th>' +
    '<th>Diameter</th>' +
    '<th>Length</th>' +
    '<th>Doyle</th>' +
    '<th>Scribner</th>' +
    "<th>Int'l</th>" +
    '<th>ROY</th>' +
    '</tr>\n</thead>\n'

  text += '<tbody>\n'
  var totalDoyle = 0, totalScribner = 0, totalInternational = 0, totalRoy = 0
  items.value.forEach((item, idx) => {
    text += '<tr>' +
      '<td class="left">' + (idx + 1) + '</td>' +
      '<td>' + item.quantity + '</td>' +
      '<td>' + item.diameter + ' mm</td>' +
      '<td>' + item.length + ' m</td>' +
      '<td>' + formatM3(item.doyle) + ' m&#179;</td>' +
      '<td>' + formatM3(item.scribner) + ' m&#179;</td>' +
      '<td>' + formatM3(item.international) + ' m&#179;</td>' +
      '<td>' + formatM3(item.roy) + ' m&#179;</td>' +
      '</tr>\n'
    totalDoyle += item.doyle
    totalScribner += item.scribner
    totalInternational += item.international
    totalRoy += item.roy
  })
  text += '</tbody>\n'

  text += '<tfoot>\n<tr>' +
    '<th></th><th></th><th></th><th></th>' +
    '<th>' + formatM3(totalDoyle) + ' m&#179;</th>' +
    '<th>' + formatM3(totalScribner) + ' m&#179;</th>' +
    '<th>' + formatM3(totalInternational) + ' m&#179;</th>' +
    '<th>' + formatM3(totalRoy) + ' m&#179;</th>' +
    '</tr></tfoot>\n'
  text += '</table>\n'

  sendEmail(subject, text, 'LogVolume.pdf')
}
</script>

<style scoped>
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
