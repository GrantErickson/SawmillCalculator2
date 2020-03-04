document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    setTimeout(() => {
        StatusBar.backgroundColorByHexString("#ffffff");        
        StatusBar.overlaysWebView(false);
        StatusBar.styleDefault();
        }, 2500);
}


// Formats money . and ,.
Number.prototype.formatMoney = function (c, d, t) {
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
    return this.formatMoney(0, ".", ",");
};

// Format a number for Bft. 
Number.prototype.formatBft2 = function () {
    return this.formatMoney(2, ".", ",");
};

// Format a number for Cubic Meters. 
Number.prototype.formatM3 = function () {
    return this.formatMoney(4, ".", ",");
};


// Format a number for Bft. 
Number.prototype.round = function (places) {
    return round(this, places);
};


// Rounds the number to places.
function round(num, places) {
    return Math.round(num * Math.pow(10, places)) / Math.pow(10, places);
}

// Sends emails
function commonSendEmail(subject, body, filename) {
    //alert("Starting email");
    var doc = new jsPDF("p", "pt", "letter");
    doc.fromHTML(body, 15, 15);
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        console.log(body);
        doc.save("test.pdf");
        return;
    }
    //alert("PDF built");

    try {
        let pdfString = doc.output('datauri');
        let uristringparts = pdfString.split(',');
        uristringparts[0] = "base64:" + filename + "//";
        let pdfUri = uristringparts.join("");
        //alert("Got PDF Bytes");
        cordova.plugins.email.open({
            subject: subject,
            attachments: [pdfUri],
            isHtml: true,
            body: body
        });
        //alert("Email API called");
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
