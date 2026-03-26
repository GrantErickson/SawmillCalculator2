// Capacitor: StatusBar is configured declaratively in capacitor.config.json.
// No programmatic initialization is needed. The config handles:
//   - backgroundColor: "#ffffff"
//   - overlaysWebView: false
//   - style: "DARK"


// Formats Money
Number.prototype.formatMoney = function (c, d, t) {
    if (settingsModel.moneySymbolLocation() == 'before'){
        return settingsModel.moneySymbol() + this.formatNumber(c, d,t);
    }else{
        return  this.formatNumber(c, d,t) + settingsModel.moneySymbol();
    }
};

// Formats numbers with . and ,.
Number.prototype.formatNumber = function (c, d, t) {
    var n = this, 
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};


// Format a number for Bft. 
Number.prototype.formatBft = function () {
    return this.formatNumber(0, ".", ",");
};

// Format a number for Bft. 
Number.prototype.formatBft2 = function () {
    return this.formatNumber(2, ".", ",");
};

// Format a number for Cubic Meters. 
Number.prototype.formatM3 = function (places) {
    return this.formatNumber(places || 4, ".", ",");
};


// Format a number for Bft. 
Number.prototype.round = function (places) {
    return round(this, places);
};


// Rounds the number to places.
function round(num, places) {
    return Math.round(num * Math.pow(10, places)) / Math.pow(10, places);
}

// Converts an HTML table string to readable plain text
function htmlToPlainText(html) {
    var parsed = new DOMParser().parseFromString(html, 'text/html');
    var rows = parsed.querySelectorAll('tr');
    if (rows.length > 0) {
        var lines = [];
        rows.forEach(function(row) {
            var cells = row.querySelectorAll('th, td');
            var cellTexts = [];
            cells.forEach(function(cell) { cellTexts.push(cell.textContent); });
            lines.push(cellTexts.join('\t'));
        });
        return lines.join('\n');
    }
    return parsed.body.textContent || '';
}

// Sends emails
function commonSendEmail(subject, body, filename) {
    var doc = new jsPDF("p", "pt", "letter");
    doc.fromHTML(body, 15, 15);

    try {
        // Use the Web Share API if available (works in Capacitor and modern mobile browsers)
        if (navigator.share && typeof navigator.canShare === 'function') {
            var pdfBlob = doc.output('blob');
            var file = new File([pdfBlob], filename, { type: 'application/pdf' });
            var plainText = htmlToPlainText(body);
            var shareData = { title: subject, text: plainText, files: [file] };
            if (navigator.canShare(shareData)) {
                navigator.share(shareData).catch(function(err) {
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
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var currentValue = valueAccessor();
        $(element).controlgroup(currentValue);
        $(element).attr("data-role", "controlgroup");
        //$( "input[type='radio']",element).on( "checkboxradiocreate", function( event, ui ) {$(element).data( "init", true )} );
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var currValue = allBindingsAccessor().value();
        var initialized = $(element).data("init");
        //if(initialized){
        $("input[type='radio']", element).prop("checked", false)
            .checkboxradio("refresh");
        $("input[type='radio'][value='" + currValue + "']", element)
            .prop("checked", true).checkboxradio("refresh");
        //}
    }
};

// Select Refresh
ko.bindingHandlers.selectRefresh = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).selectmenu("refresh");
        //}
    }
};
