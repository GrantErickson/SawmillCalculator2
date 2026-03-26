declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// jsPDF loaded from script tag in index.html
declare var jsPDF: any
