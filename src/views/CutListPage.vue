<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Cut List (US)</ion-title>
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
                  <ion-select-option value="1">1/32"</ion-select-option>
                  <ion-select-option value="2">1/16"</ion-select-option>
                  <ion-select-option value="3">3/32"</ion-select-option>
                  <ion-select-option value="4">1/8"</ion-select-option>
                  <ion-select-option value="5">5/32"</ion-select-option>
                  <ion-select-option value="6">3/16"</ion-select-option>
                  <ion-select-option value="7">7/32"</ion-select-option>
                  <ion-select-option value="8">1/4"</ion-select-option>
                  <ion-select-option value="9">9/32"</ion-select-option>
                  <ion-select-option value="10">5/16"</ion-select-option>
                  <ion-select-option value="11">11/32"</ion-select-option>
                  <ion-select-option value="12">3/8"</ion-select-option>
                </ion-select>
              </ion-item>

              <ion-item>
                <ion-select label="Thickness:" :value="String(thickness)"
                  @ionChange="thickness = Number($event.detail.value)">
                  <ion-select-option v-for="opt in thicknessOptions" :key="opt.value"
                    :value="String(opt.value)">{{ opt.label }}</ion-select-option>
                </ion-select>
              </ion-item>

              <ion-item>
                <ion-select label="Approximate Total Thickness:" :value="String(total)"
                  @ionChange="total = Number($event.detail.value)">
                  <ion-select-option v-for="n in 24" :key="n" :value="String(n)">{{ n }}"</ion-select-option>
                  <ion-select-option value="28">28"</ion-select-option>
                  <ion-select-option value="32">32"</ion-select-option>
                  <ion-select-option value="36">36"</ion-select-option>
                </ion-select>
              </ion-item>

              <ion-item>
                <ion-select label="Flitch Remaining (Slab):" :value="String(flitch)"
                  @ionChange="flitch = Number($event.detail.value)">
                  <ion-select-option value="0">None</ion-select-option>
                  <ion-select-option value="1">1/2"</ion-select-option>
                  <ion-select-option value="2">1"</ion-select-option>
                  <ion-select-option value="3">1-1/2"</ion-select-option>
                  <ion-select-option value="4">2"</ion-select-option>
                  <ion-select-option value="5">2-1/2"</ion-select-option>
                  <ion-select-option value="6">3"</ion-select-option>
                  <ion-select-option value="7">3-1/2"</ion-select-option>
                  <ion-select-option value="8">4"</ion-select-option>
                  <ion-select-option value="9">4-1/2"</ion-select-option>
                  <ion-select-option value="10">5"</ion-select-option>
                  <ion-select-option value="11">5-1/2"</ion-select-option>
                  <ion-select-option value="12">6"</ion-select-option>
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
import { ref, computed, watch } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonAccordionGroup,
  IonAccordion,
  IonCheckbox,
  IonText,
} from "@ionic/vue";
import { sideOfBlade } from "../stores/settings";

function formatSixteenths(sixteenths: number): string {
  const whole = Math.floor(sixteenths / 16);
  let rem = sixteenths - whole * 16;
  if (rem === 0) return whole > 0 ? `${whole}"` : '0"';
  let denom = 16;
  while (rem % 2 === 0) {
    rem /= 2;
    denom /= 2;
  }
  const frac = `${rem}/${denom}`;
  return whole > 0 ? `${whole}-${frac}"` : `${frac}"`;
}

const fineThicknesses = Array.from({ length: 64 - 8 + 1 }, (_, i) => {
  const value = i + 8;
  return { value, label: formatSixteenths(value) };
});
const coarseSixteenths = [72, 80, 88, 90, 96, 112, 128, 144, 160, 176, 192, 224, 256, 288, 320, 392, 480, 576];
const thicknessOptions = [
  ...fineThicknesses,
  ...coarseSixteenths.map((value) => ({ value, label: formatSixteenths(value) })),
];
const knownThickness = new Set(thicknessOptions.map((opt) => opt.value));

function loadThicknessSixteenths(): number {
  const stored = localStorage.getItem("ThicknessSixteenths");
  if (stored != null && stored !== "" && knownThickness.has(Number(stored))) {
    return Number(stored);
  }
  const legacyEighths = Number(localStorage.getItem("Thickness")) || 13;
  const migrated = legacyEighths * 2;
  return knownThickness.has(migrated) ? migrated : 26;
}

const kerf = ref(Number(localStorage.getItem("Kerf")) || 2);
const thickness = ref(loadThicknessSixteenths());
const total = ref(Number(localStorage.getItem("Total")) || 6);
const flitch = ref(Number(localStorage.getItem("Flitch")) || 0);

watch(kerf, (v) => localStorage.setItem("Kerf", String(v)));
watch(thickness, (v) => localStorage.setItem("ThicknessSixteenths", String(v)));
watch(total, (v) => localStorage.setItem("Total", String(v)));
watch(flitch, (v) => localStorage.setItem("Flitch", String(v)));

function textFrom32nd(x: number, index: number) {
  var inches = Math.floor(x / 32);
  var fraction = x - inches * 32;
  var ftext = "";
  switch (fraction) {
    case 0:
      ftext = "";
      break;
    case 1:
      ftext = "1/32";
      break;
    case 2:
      ftext = "1/16";
      break;
    case 3:
      ftext = "3/32";
      break;
    case 4:
      ftext = "1/8";
      break;
    case 5:
      ftext = "5/32";
      break;
    case 6:
      ftext = "3/16";
      break;
    case 7:
      ftext = "7/32";
      break;
    case 8:
      ftext = "1/4";
      break;
    case 9:
      ftext = "9/32";
      break;
    case 10:
      ftext = "5/16";
      break;
    case 11:
      ftext = "11/32";
      break;
    case 12:
      ftext = "3/8";
      break;
    case 13:
      ftext = "13/32";
      break;
    case 14:
      ftext = "7/16";
      break;
    case 15:
      ftext = "15/32";
      break;
    case 16:
      ftext = "1/2";
      break;
    case 17:
      ftext = "17/32";
      break;
    case 18:
      ftext = "9/16";
      break;
    case 19:
      ftext = "19/32";
      break;
    case 20:
      ftext = "5/8";
      break;
    case 21:
      ftext = "21/32";
      break;
    case 22:
      ftext = "11/16";
      break;
    case 23:
      ftext = "23/32";
      break;
    case 24:
      ftext = "3/4";
      break;
    case 25:
      ftext = "25/32";
      break;
    case 26:
      ftext = "13/16";
      break;
    case 27:
      ftext = "27/32";
      break;
    case 28:
      ftext = "7/8";
      break;
    case 29:
      ftext = "29/32";
      break;
    case 30:
      ftext = "15/16";
      break;
    case 31:
      ftext = "31/32";
      break;
  }

  var result: string;
  if (inches > 0 && ftext != "") {
    result = inches + "-" + ftext + '"';
  } else if (inches > 0 && ftext == "") {
    result = inches + '"';
  } else {
    result = ftext + '"';
  }

  return { measurement: result, id: "Index" + index, checked: false };
}

const cutList = computed(() => {
  var list: Array<{ measurement: string; id: string; checked: boolean }> = [];
  var index = 1;

  // Calculate everything in 32nds of an inch.
  var currentCut = Number(flitch.value) * 16;
  // Add the flitch cut if necessary
  if (currentCut > 0) {
    if (sideOfBlade.value == "top") {
      currentCut += Number(kerf.value);
    }
    list.push(textFrom32nd(currentCut, index));
    if (sideOfBlade.value == "bottom") {
      currentCut += Number(kerf.value);
    }
    index++;
  }

  // Loop and figure out all the cuts.
  while (currentCut <= Number(total.value * 32)) {
    currentCut += Number(thickness.value * 2);
    if (sideOfBlade.value == "top") {
      currentCut += Number(kerf.value);
    }
    if (currentCut > 0) {
      list.push(textFrom32nd(currentCut, index));
      index++;
    }
    if (sideOfBlade.value == "bottom") {
      currentCut += Number(kerf.value);
    }
  }

  list.reverse();
  return list;
});
</script>
