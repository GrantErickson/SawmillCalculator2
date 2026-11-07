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

              <template v-for="(zone, zoneIndex) in zones" :key="zoneIndex">
                <ion-item>
                  <ion-select :label="thicknessLabel(zoneIndex)" :value="String(zone.thickness)"
                    @ionChange="setZoneThickness(zoneIndex, Number($event.detail.value))">
                    <ion-select-option v-for="opt in thicknessOptions" :key="opt.value"
                      :value="String(opt.value)">{{ opt.label }}</ion-select-option>
                  </ion-select>
                </ion-item>
                <ion-item v-if="zoneIndex < zones.length - 1">
                  <ion-input label="Number of boards:" label-placement="stacked" type="number" min="1" max="100"
                    :value="String(zone.count ?? 1)"
                    @ionInput="setZoneCount(zoneIndex, Number($event.detail.value))"></ion-input>
                  <ion-button slot="end" fill="clear" color="danger" @click="removeZone(zoneIndex)">
                    Remove
                  </ion-button>
                </ion-item>
                <ion-item v-else>
                  <ion-label class="ion-text-wrap">
                    <p>This thickness fills the rest of the cant.</p>
                  </ion-label>
                  <ion-button v-if="zones.length > 1" slot="end" fill="clear" color="danger"
                    @click="removeZone(zoneIndex)">
                    Remove
                  </ion-button>
                </ion-item>
              </template>
              <ion-item>
                <ion-button expand="block" fill="outline" @click="addZone">Add another thickness</ion-button>
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
  IonInput,
  IonButton,
} from "@ionic/vue";
import { sideOfBlade } from "../stores/settings";
import { buildCutPositions, type StackZone } from "../utils/cutStack";

const thicknessOptions = [
  { value: 4, label: '1/2"' },
  { value: 5, label: '5/8"' },
  { value: 6, label: '3/4"' },
  { value: 7, label: '7/8"' },
  { value: 8, label: '1"' },
  { value: 9, label: '1-1/8"' },
  { value: 10, label: '1-1/4"' },
  { value: 11, label: '1-3/8"' },
  { value: 12, label: '1-1/2"' },
  { value: 13, label: '1-5/8"' },
  { value: 14, label: '1-3/4"' },
  { value: 15, label: '1-7/8"' },
  { value: 16, label: '2"' },
  { value: 17, label: '2-1/8"' },
  { value: 18, label: '2-1/4"' },
  { value: 19, label: '2-3/8"' },
  { value: 20, label: '2-1/2"' },
  { value: 21, label: '2-5/8"' },
  { value: 22, label: '2-3/4"' },
  { value: 23, label: '2-7/8"' },
  { value: 24, label: '3"' },
  { value: 25, label: '3-1/8"' },
  { value: 26, label: '3-1/4"' },
  { value: 27, label: '3-3/8"' },
  { value: 28, label: '3-1/2"' },
  { value: 29, label: '3-5/8"' },
  { value: 30, label: '3-3/4"' },
  { value: 31, label: '3-7/8"' },
  { value: 32, label: '4"' },
  { value: 36, label: '4-1/2"' },
  { value: 40, label: '5"' },
  { value: 44, label: '5-1/2"' },
  { value: 45, label: '5-5/8"' },
  { value: 48, label: '6"' },
  { value: 56, label: '7"' },
  { value: 64, label: '8"' },
  { value: 72, label: '9"' },
  { value: 80, label: '10"' },
  { value: 88, label: '11"' },
  { value: 96, label: '12"' },
  { value: 112, label: '14"' },
  { value: 128, label: '16"' },
  { value: 144, label: '18"' },
  { value: 160, label: '20"' },
  { value: 196, label: '24"' },
  { value: 240, label: '30"' },
  { value: 288, label: '36"' },
];

const knownThickness = new Set(thicknessOptions.map((opt) => opt.value));

function loadZones(): StackZone[] {
  const stored = localStorage.getItem("CutStack");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((zone) => ({
          thickness: knownThickness.has(Number(zone.thickness))
            ? Number(zone.thickness)
            : 13,
          count:
            zone.count == null
              ? null
              : Math.min(100, Math.max(1, Math.round(Number(zone.count)))),
        }));
      }
    } catch {
      /* use the single saved thickness */
    }
  }
  const saved = Number(localStorage.getItem("Thickness")) || 13;
  return [{ thickness: knownThickness.has(saved) ? saved : 13, count: null }];
}

const kerf = ref(Number(localStorage.getItem("Kerf")) || 2);
const zones = ref<StackZone[]>(loadZones());
const total = ref(Number(localStorage.getItem("Total")) || 6);
const flitch = ref(Number(localStorage.getItem("Flitch")) || 0);

function thicknessLabel(index: number): string {
  if (zones.value.length === 1) return "Thickness:";
  return `Thickness ${index + 1}:`;
}

function setZoneThickness(index: number, value: number) {
  if (!knownThickness.has(value)) return;
  zones.value[index].thickness = value;
}

function setZoneCount(index: number, value: number) {
  const count = Math.min(100, Math.max(1, Math.round(Number(value)) || 1));
  zones.value[index].count = count;
}

function addZone() {
  const next = zones.value.slice();
  const previous = next[next.length - 1];
  next[next.length - 1] = {
    thickness: previous.thickness,
    count: previous.count ?? 2,
  };
  next.push({ thickness: 9, count: null });
  zones.value = next;
}

function removeZone(index: number) {
  if (zones.value.length === 1) return;
  const next = zones.value.filter((_, i) => i !== index);
  next[next.length - 1] = { ...next[next.length - 1], count: null };
  zones.value = next;
}

watch(kerf, (v) => localStorage.setItem("Kerf", String(v)));
watch(total, (v) => localStorage.setItem("Total", String(v)));
watch(flitch, (v) => localStorage.setItem("Flitch", String(v)));
watch(
  zones,
  (v) => {
    localStorage.setItem("CutStack", JSON.stringify(v));
    const fill = v[v.length - 1];
    if (fill) localStorage.setItem("Thickness", String(fill.thickness));
  },
  { deep: true },
);

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
  const positions = buildCutPositions({
    flitchHalfInches: Number(flitch.value),
    totalInches: Number(total.value),
    kerf32: Number(kerf.value),
    side: sideOfBlade.value,
    zones: zones.value,
  });
  return positions
    .map((position, index) => textFrom32nd(position, index + 1))
    .reverse();
});
</script>
