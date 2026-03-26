// Capacitor: StatusBar is configured declaratively in capacitor.config.json.
// No programmatic initialization is needed. The config handles:
//   - backgroundColor: "#ffffff"
//   - overlaysWebView: false
//   - style: "DARK"


// Formats Money
Number.prototype.formatMoney = function (c?: number, d?: string, t?: string): string {
    if (settingsModel.moneySymbolLocation() == 'before') {
        return settingsModel.moneySymbol() + this.formatNumber(c, d, t);
    } else {
        return this.formatNumber(c, d, t) + settingsModel.moneySymbol();
    }
};

// Formats numbers with . and ,.
Number.prototype.formatNumber = function (c?: number, d?: string, t?: string): string {
    var n = this as number,
        prec = isNaN(c = Math.abs(c)) ? 2 : c,
        dec = d == undefined ? "." : d,
        thou = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(String(Math.abs(+n || 0).toFixed(prec))) + "",
        j = i.length > 3 ? i.length % 3 : 0;
    return s + (j ? i.substr(0, j) + thou : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thou) + (prec ? dec + Math.abs(n - Number(i)).toFixed(prec).slice(2) : "");
};


// Format a number for Bft.
Number.prototype.formatBft = function (): string {
    return this.formatNumber(0, ".", ",");
};

// Format a number for Bft with 2 decimal places.
Number.prototype.formatBft2 = function (): string {
    return this.formatNumber(2, ".", ",");
};

// Format a number for Cubic Meters.
Number.prototype.formatM3 = function (places?: number): string {
    return this.formatNumber(places || 4, ".", ",");
};


// Round a number to a given number of decimal places.
Number.prototype.round = function (places: number): number {
    return round(this as number, places);
};


// Rounds the number to places.
function round(num: number, places: number): number {
    return Math.round(num * Math.pow(10, places)) / Math.pow(10, places);
}

// Converts an HTML table string to readable plain text
function htmlToPlainText(html: string): string {
    var parsed = new DOMParser().parseFromString(html, 'text/html');
    var rows = parsed.querySelectorAll('tr');
    if (rows.length > 0) {
        var lines: string[] = [];
        rows.forEach(function (row) {
            var cells = row.querySelectorAll('th, td');
            var cellTexts: string[] = [];
            cells.forEach(function (cell) { cellTexts.push(cell.textContent); });
            lines.push(cellTexts.join('\t'));
        });
        return lines.join('\n');
    }
    return parsed.body.textContent || '';
}

// Sends emails
function commonSendEmail(subject: string, body: string, filename: string): void {
    var doc = new jsPDF("p", "pt", "letter");
    doc.fromHTML(body, 15, 15);

    try {
        // Use email composer plugin for HTML body with PDF attachment (native platforms)
        if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.EmailComposer) {
            var dataUri = doc.output('datauristring');
            var base64Idx = dataUri.indexOf('base64,');
            var base64Pdf = base64Idx !== -1 ? dataUri.substring(base64Idx + 7) : '';
            Capacitor.Plugins.EmailComposer.open({
                subject: subject,
                body: body,
                isHtml: true,
                attachments: [{
                    type: 'base64',
                    path: base64Pdf,
                    name: filename
                }]
            }).catch(function (err: any) {
                console.log('Email composer failed:', err);
                doc.save(filename);
            });
            return;
        }
        // Fallback: Use the Web Share API if available
        if (navigator.share && typeof navigator.canShare === 'function') {
            var pdfBlob = doc.output('blob');
            var file = new File([pdfBlob], filename, { type: 'application/pdf' });
            var plainText = htmlToPlainText(body);
            var shareData = { title: subject, text: plainText, files: [file] };
            if (navigator.canShare(shareData)) {
                navigator.share(shareData).catch(function (err: any) {
                    // User cancelled or share failed, fall back to saving
                    console.log('Share cancelled or failed:', err);
                    doc.save(filename);
                });
                return;
            }
        }
        // Fallback: save the PDF directly
        console.log(body);
        doc.save(filename);
    }
    catch (error) {
        alert(error);
    }
}

var pdfStyles = '<style>\n' +
    'td, th {\n' +
    '	border: 1px solid black;\n' +
    '	padding-left: 8px;\n' +
    '	padding-right: 8px;\n' +
    '	padding-top: 3px;\n' +
    '	padding-bottom: 3px;\n' +
    '	text-align: right;\n' +
    '}\n' +
    'table {\n' +
    '	border-collapse:collapse;\n' +
    '	font-size:.5em;\n' +
    '}\n' +
    'td.left, th.left {\n' +
    '   text-align:left;\n' +
    '}\n' +
    'th {\n' +
    '   font-weight: bold;\n' +
    '}\n' +
    '</style>\n';


// Radio button bindings
ko.bindingHandlers.jqCheckboxRadio = {
    init: function (element: any, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: any) {
        var currentValue = valueAccessor();
        $(element).controlgroup(currentValue);
        $(element).attr("data-role", "controlgroup");
    },
    update: function (element: any, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: any) {
        var currValue = allBindingsAccessor().value();
        $("input[type='radio']", element).prop("checked", false)
            .checkboxradio("refresh");
        $("input[type='radio'][value='" + currValue + "']", element)
            .prop("checked", true).checkboxradio("refresh");
    }
};

// Select Refresh
ko.bindingHandlers.selectRefresh = {
    init: function (element: any, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: any) {
    },
    update: function (element: any, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: any) {
        $(element).selectmenu("refresh");
    }
};

// Checkbox binding (previously duplicated in cutlist.js and cutlistMetric.js)
ko.bindingHandlers.checkbox = {
    init: function (element: any) {
        $(element).checkboxradio();
    },
    update: function (element: any, valueAccessor: any) {
        $(element).checkboxradio("refresh");
    }
};

// Slider binding (previously duplicated in volume.js, volumeMetric.js, boardfeet.js, boardfeetMetric.js)
ko.bindingHandlers.slider = {
    init: function (element: any, valueAccessor: any) {
        var val = valueAccessor()();
        $(element).slider({
            value: val,
            step: 1,
            slide: function (event: any, ui: any) {
                valueAccessor()(ui.value);
            }
        });
    },
    update: function (element: any, valueAccessor: any) {
        $(element).slider("option", "value", valueAccessor()());
    }
};
