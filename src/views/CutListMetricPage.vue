<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Cut List (Metric)</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-accordion-group :value="['specs', 'cutlist']" :multiple="true">
        <ion-accordion value="specs">
          <ion-item slot="header" color="primary">
            <ion-label>Mill Specs and Board Dimensions</ion-label>
          </ion-item>
          <div slot="content" class="ion-padding">
            <ion-list>
              <ion-item>
                <ion-select label="Kerf:" :value="String(kerf)" @ionChange="kerf = Number($event.detail.value)">
                  <ion-select-option value="0">None</ion-select-option>
                  <ion-select-option v-for="n in 10" :key="n" :value="String(n)">{{ n }}mm</ion-select-option>
                </ion-select>
              </ion-item>

              <ion-item>
                <ion-select label="Thickness:" :value="String(thickness)" @ionChange="thickness = Number($event.detail.value)">
                  <ion-select-option v-for="opt in thicknessOptions" :key="opt.value" :value="String(opt.value)">{{ opt.label }}</ion-select-option>
                </ion-select>
              </ion-item>

              <ion-item>
                <ion-select label="Approximate Total Thickness:" :value="String(total)" @ionChange="total = Number($event.detail.value)">
                  <ion-select-option v-for="opt in totalOptions" :key="opt.value" :value="String(opt.value)">{{ opt.label }}</ion-select-option>
                </ion-select>
              </ion-item>

              <ion-item>
                <ion-select label="Flitch Remaining (Slab):" :value="String(flitch)" @ionChange="flitch = Number($event.detail.value)">
                  <ion-select-option value="0">None</ion-select-option>
                  <ion-select-option v-for="opt in flitchOptions" :key="opt.value" :value="String(opt.value)">{{ opt.label }}</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>
          </div>
        </ion-accordion>

        <ion-accordion value="cutlist">
          <ion-item slot="header" color="primary">
            <ion-label>Cut List</ion-label>
          </ion-item>
          <div slot="content">
            <ion-list>
              <ion-item v-for="(cut, index) in cutList" :key="cut.id">
                <ion-checkbox :checked="cut.checked" @ionChange="cut.checked = $event.detail.checked">
                  {{ cut.measurement }}
                </ion-checkbox>
              </ion-item>
            </ion-list>
          </div>
        </ion-accordion>
      </ion-accordion-group>

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
  IonSelect, IonSelectOption, IonAccordionGroup, IonAccordion,
  IonCheckbox, IonText
} from '@ionic/vue'
import { sideOfBlade } from '../stores/settings'

const kerf = ref(Number(localStorage.getItem('MetricKerf')) || 3)
const thickness = ref(Number(localStorage.getItem('MetricThickness')) || 38)
const total = ref(Number(localStorage.getItem('MetricTotal')) || 300)
const flitch = ref(Number(localStorage.getItem('MetricFlitch')) || 0)

watch(kerf, (v) => localStorage.setItem('MetricKerf', String(v)))
watch(thickness, (v) => localStorage.setItem('MetricThickness', String(v)))
watch(total, (v) => localStorage.setItem('MetricTotal', String(v)))
watch(flitch, (v) => localStorage.setItem('MetricFlitch', String(v)))

const thicknessOptions = [
  { value: 4, label: '4mm' }, { value: 5, label: '5mm' }, { value: 6, label: '6mm' },
  { value: 7, label: '7mm' }, { value: 8, label: '8mm' }, { value: 9, label: '9mm' },
  { value: 10, label: '10mm' }, { value: 12, label: '12mm' }, { value: 15, label: '15mm' },
  { value: 18, label: '18mm' }, { value: 19, label: '19mm (.75")' }, { value: 20, label: '20mm' },
  { value: 22, label: '22mm' }, { value: 25, label: '25mm' }, { value: 26, label: '26mm' },
  { value: 30, label: '30mm' }, { value: 32, label: '32mm' }, { value: 35, label: '35mm' },
  { value: 38, label: '38mm (1.5")' }, { value: 40, label: '40mm' }, { value: 45, label: '45mm' },
  { value: 50, label: '50mm' }, { value: 55, label: '55mm' }, { value: 60, label: '60mm' },
  { value: 64, label: '64mm (2.5")' }, { value: 65, label: '65mm' }, { value: 70, label: '70mm' },
  { value: 80, label: '80mm' }, { value: 89, label: '89mm (3.5")' }, { value: 90, label: '90mm' },
  { value: 100, label: '100mm' }, { value: 105, label: '105mm' }, { value: 114, label: '114mm (4.5")' },
  { value: 120, label: '120mm' }, { value: 140, label: '140mm' }, { value: 160, label: '160mm' },
  { value: 180, label: '180mm' }, { value: 184, label: '184mm' }, { value: 200, label: '200mm' },
  { value: 220, label: '220mm' }, { value: 235, label: '235mm' }, { value: 250, label: '250mm' },
  { value: 275, label: '275mm' }, { value: 286, label: '286mm' }, { value: 300, label: '300mm' },
  { value: 350, label: '350mm' }, { value: 400, label: '400mm' }, { value: 450, label: '450mm' },
  { value: 500, label: '500mm' }
]

const totalOptions = [
  { value: 50, label: '50mm' }, { value: 75, label: '75mm' }, { value: 100, label: '100mm' },
  { value: 200, label: '200mm' }, { value: 300, label: '300mm' }, { value: 350, label: '350mm' },
  { value: 400, label: '400mm' }, { value: 450, label: '450mm' }, { value: 500, label: '500mm' },
  { value: 600, label: '600mm' }, { value: 700, label: '700mm' }, { value: 800, label: '800mm' },
  { value: 900, label: '900mm' }, { value: 1000, label: '1m' }
]

const flitchOptions = [
  { value: 4, label: '4mm' }, { value: 5, label: '5mm' }, { value: 6, label: '6mm' },
  { value: 7, label: '7mm' }, { value: 8, label: '8mm' }, { value: 9, label: '9mm' },
  { value: 10, label: '10mm' }, { value: 15, label: '15mm' }, { value: 19, label: '19mm (.75")' },
  { value: 20, label: '20mm' }, { value: 25, label: '25mm' }, { value: 30, label: '30mm' },
  { value: 32, label: '32mm' }, { value: 35, label: '35mm' }, { value: 38, label: '38mm (1.5")' },
  { value: 40, label: '40mm' }, { value: 45, label: '45mm' }, { value: 50, label: '50mm' },
  { value: 55, label: '55mm' }, { value: 60, label: '60mm' }, { value: 64, label: '64mm (2.5")' },
  { value: 65, label: '65mm' }, { value: 70, label: '70mm' }, { value: 80, label: '80mm' },
  { value: 89, label: '89mm (3.5")' }, { value: 90, label: '90mm' }, { value: 100, label: '100mm' },
  { value: 114, label: '114mm (4.5")' }, { value: 120, label: '120mm' }, { value: 140, label: '140mm' },
  { value: 160, label: '160mm' }, { value: 180, label: '180mm' }, { value: 184, label: '184mm' },
  { value: 200, label: '200mm' }, { value: 220, label: '220mm' }, { value: 235, label: '235mm' },
  { value: 250, label: '250mm' }, { value: 275, label: '275mm' }, { value: 286, label: '286mm' },
  { value: 300, label: '300mm' }, { value: 350, label: '350mm' }, { value: 400, label: '400mm' },
  { value: 450, label: '450mm' }, { value: 500, label: '500mm' }
]

function textFromMm(x: number, index: number) {
  var mm = Math.floor(x)
  return { measurement: mm + 'mm', id: 'Index' + index, checked: false }
}

const cutList = computed(() => {
  var list: Array<{ measurement: string; id: string; checked: boolean }> = []
  var index = 1

  // Calculate everything in millimeters.
  var currentCut = Number(flitch.value)
  // Add the flitch cut if necessary
  if (currentCut > 0) {
    if (sideOfBlade.value == 'top') {
      currentCut += Number(kerf.value)
    }
    list.push(textFromMm(currentCut, index))
    if (sideOfBlade.value == 'bottom') {
      currentCut += Number(kerf.value)
    }
    index++
  }

  // Loop and figure out all the cuts.
  while (currentCut <= Number(total.value)) {
    currentCut += Number(thickness.value)
    if (sideOfBlade.value == 'top') {
      currentCut += Number(kerf.value)
    }
    if (currentCut > 0) {
      list.push(textFromMm(currentCut, index))
      index++
    }
    if (sideOfBlade.value == 'bottom') {
      currentCut += Number(kerf.value)
    }
  }

  list.reverse()
  return list
})
</script>
