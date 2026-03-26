// jQuery and jQuery Mobile
declare var $: any;
declare var jQuery: any;

// KnockoutJS
declare var ko: any;

// jsPDF
declare var jsPDF: any;

// Capacitor
declare var Capacitor: any;

// Custom globals shared across scripts
declare var settingsModel: any;
declare var pdfStyles: string;
declare var WoodTypes: any;
declare var volumeModel: any;
declare var volumeMetricModel: any;
declare var boardFeetModel: any;
declare var boardFeetMetricModel: any;
declare var VolumeItem: any;
declare var VolumeMetricItem: any;
declare var LumberItem: any;
declare var LumberItemMetric: any;

// Number prototype extensions
interface Number {
    formatMoney(c?: number, d?: string, t?: string): string;
    formatNumber(c?: number, d?: string, t?: string): string;
    formatBft(): string;
    formatBft2(): string;
    formatM3(places?: number): string;
    round(places: number): number;
}
