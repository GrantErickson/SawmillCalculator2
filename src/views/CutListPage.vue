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
                <ion-input label="Kerf, inches:" label-placement="stacked" type="number" inputmode="decimal" min="0"
                  max="0.5" step="0.001" :value="kerfDraft" @ionFocus="selectOnFocus"
                  @ionInput="kerfDraft = String($event.detail.value ?? '')" @ionBlur="commitKerf"
                  @ionChange="commitKerf"></ion-input>
                <ion-note slot="end">{{ kerfLabel }}</ion-note>
              </ion-item>

              <ion-item>
                <ion-select label="Thickness:" :value="String(thickness)"
                  @ionChange="thickness = Number($event.detail.value)">
                  <ion-select-option value="4">1/2"</ion-select-option>
                  <ion-select-option value="5">5/8"</ion-select-option>
                  <ion-select-option value="6">3/4"</ion-select-option>
                  <ion-select-option value="7">7/8"</ion-select-option>
                  <ion-select-option value="8">1"</ion-select-option>
                  <ion-select-option value="9">1-1/8"</ion-select-option>
                  <ion-select-option value="10">1-1/4"</ion-select-option>
                  <ion-select-option value="11">1-3/8"</ion-select-option>
                  <ion-select-option value="12">1-1/2"</ion-select-option>
                  <ion-select-option value="13">1-5/8"</ion-select-option>
                  <ion-select-option value="14">1-3/4"</ion-select-option>
                  <ion-select-option value="15">1-7/8"</ion-select-option>
                  <ion-select-option value="16">2"</ion-select-option>
                  <ion-select-option value="17">2-1/8"</ion-select-option>
                  <ion-select-option value="18">2-1/4"</ion-select-option>
                  <ion-select-option value="19">2-3/8"</ion-select-option>
                  <ion-select-option value="20">2-1/2"</ion-select-option>
                  <ion-select-option value="21">2-5/8"</ion-select-option>
                  <ion-select-option value="22">2-3/4"</ion-select-option>
                  <ion-select-option value="23">2-7/8"</ion-select-option>
                  <ion-select-option value="24">3"</ion-select-option>
                  <ion-select-option value="25">3-1/8"</ion-select-option>
                  <ion-select-option value="26">3-1/4"</ion-select-option>
                  <ion-select-option value="27">3-3/8"</ion-select-option>
                  <ion-select-option value="28">3-1/2"</ion-select-option>
                  <ion-select-option value="29">3-5/8"</ion-select-option>
                  <ion-select-option value="30">3-3/4"</ion-select-option>
                  <ion-select-option value="31">3-7/8"</ion-select-option>
                  <ion-select-option value="32">4"</ion-select-option>
                  <ion-select-option value="36">4-1/2"</ion-select-option>
                  <ion-select-option value="40">5"</ion-select-option>
                  <ion-select-option value="44">5-1/2"</ion-select-option>
                  <ion-select-option value="45">5-5/8"</ion-select-option>
                  <ion-select-option value="48">6"</ion-select-option>
                  <ion-select-option value="56">7"</ion-select-option>
                  <ion-select-option value="64">8"</ion-select-option>
                  <ion-select-option value="72">9"</ion-select-option>
                  <ion-select-option value="80">10"</ion-select-option>
                  <ion-select-option value="88">11"</ion-select-option>
                  <ion-select-option value="96">12"</ion-select-option>
                  <ion-select-option value="112">14"</ion-select-option>
                  <ion-select-option value="128">16"</ion-select-option>
                  <ion-select-option value="144">18"</ion-select-option>
                  <ion-select-option value="160">20"</ion-select-option>
                  <ion-select-option value="196">24"</ion-select-option>
                  <ion-select-option value="240">30"</ion-select-option>
                  <ion-select-option value="288">36"</ion-select-option>
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
  IonInput,
  IonNote,
} from "@ionic/vue";
import { sideOfBlade } from "../stores/settings";

function loadKerfInches(): number {
  const stored = localStorage.getItem("KerfInches");
  if (stored != null && stored !== "") return clampKerf(Number(stored));
  const legacy = localStorage.getItem("Kerf");
  if (legacy == null || legacy === "") return 1 / 16;
  return clampKerf(Number(legacy) / 32);
}

function clampKerf(inches: number): number {
  if (!Number.isFinite(inches)) return 0;
  return Math.min(0.5, Math.max(0, inches));
}

function roundUpTo32nd(position: number): number {
  return Math.ceil(position - 1e-6);
}

const kerfInches = ref(loadKerfInches());
const kerfDraft = ref(String(kerfInches.value));
const kerfLabel = computed(() => {
  const thirty2 = kerfInches.value * 32;
  const nearest = Math.round(thirty2);
  if (Math.abs(thirty2 - nearest) < 1e-4) {
    return nearest === 0 ? "None" : textFrom32nd(nearest, 0).measurement;
  }
  return `${kerfInches.value.toFixed(3)}"`;
});

function commitKerf() {
  kerfInches.value = clampKerf(Number(kerfDraft.value));
  kerfDraft.value = String(kerfInches.value);
}

function selectOnFocus(event: any) {
  const input = event.target?.querySelector("input");
  if (input) input.select();
}
const thickness = ref(Number(localStorage.getItem("Thickness")) || 13);
const total = ref(Number(localStorage.getItem("Total")) || 6);
const flitch = ref(Number(localStorage.getItem("Flitch")) || 0);

watch(kerfInches, (v) => localStorage.setItem("KerfInches", String(v)));
watch(thickness, (v) => localStorage.setItem("Thickness", String(v)));
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

  // Calculate everything in 32nds of an inch. Kerf may fall between those marks.
  var currentCut = Number(flitch.value) * 16;
  var kerf32 = Number(kerfInches.value) * 32;
  function pushCut(position: number) {
    const rounded = roundUpTo32nd(position);
    list.push(textFrom32nd(rounded, index));
    index++;
    return rounded;
  }
  // Add the flitch cut if necessary
  if (currentCut > 0) {
    if (sideOfBlade.value == "top") {
      currentCut += kerf32;
    }
    currentCut = pushCut(currentCut);
    if (sideOfBlade.value == "bottom") {
      currentCut += kerf32;
    }
  }

  // Loop and figure out all the cuts.
  while (currentCut <= Number(total.value * 32)) {
    currentCut += Number(thickness.value * 4);
    if (sideOfBlade.value == "top") {
      currentCut += kerf32;
    }
    if (currentCut > 0) {
      currentCut = pushCut(currentCut);
    }
    if (sideOfBlade.value == "bottom") {
      currentCut += kerf32;
    }
  }

  list.reverse();
  return list;
});
</script>
