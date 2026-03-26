<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Log Volume (US)</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-range
            label="Diameter in inches:"
            :min="1" :max="40" :step="1"
            :value="diameter"
            :pin="true"
            :pin-formatter="(v: number) => v + '&quot;'"
            @ionInput="updateDiameter($event.detail.value)"
          ></ion-range>
        </ion-item>
        <ion-item>
          <ion-range
            label="Length in feet:"
            :min="1" :max="40" :step="1"
            :value="length"
            :pin="true"
            :pin-formatter="(v: number) => v + '\''"
            @ionInput="updateLength($event.detail.value)"
          ></ion-range>
        </ion-item>
        <ion-item>
          <ion-range
            label="Quantity:"
            :min="1" :max="100" :step="1"
            :value="quantity"
            :pin="true"
            @ionInput="updateQuantity($event.detail.value)"
          ></ion-range>
        </ion-item>
      </ion-list>

      <!-- Calculations -->
      <ion-list inset>
        <ion-list-header>
          <ion-label>Calculations</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-label>Doyle</ion-label>
          <ion-note slot="end">{{ formatBft(doyle) }} bft</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Scribner</ion-label>
          <ion-note slot="end">{{ formatBft(scribner) }} bft</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>International</ion-label>
          <ion-note slot="end">{{ formatBft(international) }} bft</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>ROY</ion-label>
          <ion-note slot="end">{{ formatBft(roy) }} bft</ion-note>
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
              D:{{ formatBft(item.doyle) }}
              S:{{ formatBft(item.scribner) }}
              I:{{ formatBft(item.international) }}
              R:{{ formatBft(item.roy) }}
            </h2>
            <p>
              Diameter: {{ item.diameter }}"
              &nbsp; Length: {{ item.length }}'
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
          <ion-note slot="end">{{ formatBft(grandTotalDoyle) }} bft</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Scribner</ion-label>
          <ion-note slot="end">{{ formatBft(grandTotalScribner) }} bft</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>International</ion-label>
          <ion-note slot="end">{{ formatBft(grandTotalInternational) }} bft</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>ROY</ion-label>
          <ion-note slot="end">{{ formatBft(grandTotalRoy) }} bft</ion-note>
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
          <small>&copy; 2014 MicaPeak Solutions</small>
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
  IonRange, IonButton, IonIcon, IonNote, IonText
} from '@ionic/vue'
import { addOutline, trashOutline, mailOutline } from 'ionicons/icons'
import { formatBft } from '../utils/formatting'
import { sendEmail, pdfStyles } from '../utils/email'

const length = ref(Number(localStorage.getItem('VolumeLength')) || 16)
const diameter = ref(Number(localStorage.getItem('VolumeDiameter')) || 12)
const quantity = ref(Number(localStorage.getItem('VolumeQuantity')) || 1)

function updateLength(v: any) { length.value = Number(v) }
function updateDiameter(v: any) { diameter.value = Number(v) }
function updateQuantity(v: any) { quantity.value = Number(v) }

watch(length, (v) => localStorage.setItem('VolumeLength', String(v)))
watch(diameter, (v) => localStorage.setItem('VolumeDiameter', String(v)))
watch(quantity, (v) => localStorage.setItem('VolumeQuantity', String(v)))

const doyle = computed(() => {
  var l = Number(length.value), d = Number(diameter.value), q = Number(quantity.value)
  return Math.round((d - 4) * (d - 4) * (l / 16) * q)
})

const scribner = computed(() => {
  var l = Number(length.value), d = Number(diameter.value), q = Number(quantity.value)
  return Math.round((.79 * d * d - 2 * d - 4) * l / 16 * q)
})

const international = computed(() => {
  var l = Number(length.value), d = Number(diameter.value), q = Number(quantity.value)
  var value = 0.04976191 * l * d * d +
    0.006220239 * l * l * d -
    0.1854762 * l * d +
    0.0002591767 * l * l * l -
    0.01159226 * l * l +
    0.04222222 * l
  return Math.round(value * q)
})

const roy = computed(() => {
  var l = Number(length.value), d = Number(diameter.value), q = Number(quantity.value)
  return Math.round((d - 1) * (d - 1) * 0.5 * l / 10 * q)
})

interface VolumeItemData {
  diameter: number; length: number; quantity: number
  doyle: number; scribner: number; international: number; roy: number
}

const items = ref<VolumeItemData[]>(
  JSON.parse(localStorage.getItem('VolumeItems') || '[]')
)

watch(items, (v) => {
  localStorage.setItem('VolumeItems', JSON.stringify(v))
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
      '<td>' + item.diameter + '"</td>' +
      "<td>" + item.length + "'</td>" +
      '<td>' + formatBft(item.doyle) + '</td>' +
      '<td>' + formatBft(item.scribner) + '</td>' +
      '<td>' + formatBft(item.international) + '</td>' +
      '<td>' + formatBft(item.roy) + '</td>' +
      '</tr>\n'
    totalDoyle += item.doyle
    totalScribner += item.scribner
    totalInternational += item.international
    totalRoy += item.roy
  })
  text += '</tbody>\n'

  text += '<tfoot>\n<tr>' +
    '<th></th><th></th><th></th><th></th>' +
    '<th>' + formatBft(totalDoyle) + '</th>' +
    '<th>' + formatBft(totalScribner) + '</th>' +
    '<th>' + formatBft(totalInternational) + '</th>' +
    '<th>' + formatBft(totalRoy) + '</th>' +
    '</tr></tfoot>\n'
  text += '</table>\n'

  sendEmail(subject, text, 'LogVolume.pdf')
}
</script>
