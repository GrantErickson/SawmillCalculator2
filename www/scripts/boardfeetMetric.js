// Handles the board feet logic.
// Must call this so that we don't get more than one pageinit called.
var boardFeetMetricModel;
$(document).delegate("#pageBoardFeetMetric", "pageinit", function() {
    // Model for calculations and storing data.
    var BoardFeetMetricModel = function() {
        var self = this;

        self.maxQuantity = ko.observable(window.localStorage.getItem("maxQuantity") || "100");

        // Values for the calculation.
        self.width = ko.observable(Number(window.localStorage.getItem("BfWidthMetric")) || 100); // mm
        self.thickness = ko.observable(Number(window.localStorage.getItem("BfThicknessMetric")) || 50); // mm
        self.length = ko.observable(Number(window.localStorage.getItem("BfLengthMetric")) || 3000); // mm
        self.quantity = ko.observable(Number(window.localStorage.getItem("BfQuantityMetric")) || 1); // Count
        self.pricePerMeter3 = ko.observable(Number(window.localStorage.getItem("BfPricePerMetric")) || 1); // Count

        var oldItems = window.localStorage.getItem("LumberItemsMetric") || "[]";

        var items = $.parseJSON(oldItems);
        self.lumberItems = ko.observableArray([]); // List of items. 

        for (i in items) {
            var item = new LumberItemMetric();
            item.load(items[i]);
            self.lumberItems.push(item);
        }


        // Calculate the Total BFT
        self.totalBft = ko.computed(function() {
            var value = Number(self.width()) *
                Number(self.thickness()) *
                Number(self.length()) *
                Number(self.quantity());
            return Math.round(value /100) / 10000000;
        });
        // Calculate the Total Price
        self.totalPrice = ko.computed(function() {
            var value = Number(self.totalBft()) *
                Number(self.pricePerMeter3());
            return Math.round(value * 100) / 100;
        });
        self.pieceBft = ko.computed(function() {
            return round(self.totalBft() / self.quantity(), 5);
        }); // bft
        self.piecePrice = ko.computed(function() {
            return round(self.totalPrice() / self.quantity(), 2); // $
        });

        self.grandTotalPrice = ko.computed(function() {
            var result = 0;
            for (var item in self.lumberItems()) {
                result += self.lumberItems()[item].totalPrice();
            }
            return result;
        });
        self.grandTotalBft = ko.computed(function() {
            var result = 0;
            for (var item in self.lumberItems()) {
                result += self.lumberItems()[item].totalBft();
            }
            return result;
        });


        // Save the values. 
        self.width.subscribe(function(value) {
            window.localStorage.setItem("BfWidthMetric", value);
        });
        self.thickness.subscribe(function(value) {
            window.localStorage.setItem("BfThicknessMetric", value);
        });
        self.length.subscribe(function(value) {
            window.localStorage.setItem("BfLengthMetric", value);
        });
        self.quantity.subscribe(function(value) {
            window.localStorage.setItem("BfQuantityMetric", value);
        });
        self.pricePerMeter3.subscribe(function(value) {
            window.localStorage.setItem("BfPricePerMetric", value);
        });


        // Calculated values. 
        self.addLumberItem = function() {
            var item = new LumberItemMetric();
            item.loadKO(self);
            self.lumberItems.push(item);
            self.saveLumberItems();
        };

        self.clearLumberItems = function() {
            var r = confirm("Do you really want to clear the list?");
            if (r == true) {
                self.lumberItems.removeAll();
                self.saveLumberItems();
            }
        };

        self.saveLumberItems = function() {
            //alert(ko.toJSON(self.lumberItems));
            window.localStorage.setItem("LumberItemsMetric", ko.toJSON(self.lumberItems));
        };

        self.sendEmail = function() {
            var subject = 'Lumber List';
            var text = '';
            var totalBftSum = 0;
            var totalPriceSum = 0;

            text = pdfStyles;

            text += '\n';
            text += '<table>';
            // Header
            text += '<thead>' +
                '<tr>' +
                '<th class="left">#</th>' +
                '<th >Quantity</th>' +
                '<th>Thickness</th>' +
                '<th>Width</th>' +
                '<th>Length</th>' +
                '<th>m&#179;/piece</th>' +
                '<th>Total m&#179;</th>' +
                '<th>$/m&#179;</th>' +
                '<th>$/piece</th>' +
                '<th>Total</th>\n' +
                '</tr>' +
                '</thead>\n';

            // Body
            text += '<tbody>\n';
            var index = 0;
            $(self.lumberItems()).each(function() {
                index++;
                var pricePerMeter3 = Number(this.pricePerMeter3()).round(5);
                var piecePrice = Number(this.piecePrice()).round(2);
                var totalPrice = Number(this.totalPrice()).round(2);
                var totalBft = Number(this.totalBft()).round(2);
                var pieceBft = Number(this.pieceBft()).round(2);
                text += '  <tr>' +
                    '<td class="left">' + index + '</td>' +
                    '<td>' + this.quantity() + '</td>' +
                    '<td>' + this.thickness() + ' mm</td>' +
                    '<td>' + this.width() + ' mm</td>' +
                    '<td>' + this.length() + " mm</td>" +
                    '<td>' + pieceBft.formatM3() + '</td>' +
                    '<td>' + totalBft.formatM3() + '</td>' +
                    '<td>$' + pricePerMeter3.formatMoney() + '</td>' +
                    '<td>$' + piecePrice.formatMoney() + '</td>' +
                    '<td>$' + totalPrice.formatMoney() + '</td>' +
                    '</tr>\n';
                totalPriceSum += totalPrice;
                totalBftSum += totalBft;
            });
            text += '</tbody>\n';

            // Footer
            text += '<tfoot>\n' +
                '  <tr>' +
                '<th></th>' +
                '<th></th>' +
                '<th></th>' +
                '<th></th>' +
                '<th></th>' +
                '<th></th>' +
                '<th>' + totalBftSum.formatM3() + ' m&#179;</th>' +
                '<th></th>' +
                '<th></th>' +
                '<th>$' + totalPriceSum.formatMoney() + '</th>' +
                '</tr>' +
                '</tfoot>\n';
            text += '</table>\n';

            //window.location.href = 'mailto:?subject=' + subject + '&body=' + encodeURIComponent(text);
            commonSendEmail(subject, text, "Lumber.pdf");

            return;

        };

    };

    // Create the model and apply it.
    boardFeetMetricModel = new BoardFeetMetricModel();

    ko.applyBindings(boardFeetMetricModel, document.getElementById("pageBoardFeetMetric"));

    $("#bfWidth").slider("refresh");
    $("#bfThickness").slider("refresh");
    $("#bfLength").slider("refresh");
    $("#bfQuantity").slider("refresh");

    // Allows for changing the actual numbers for certain parameters by 1 and then setting it back to 5 when using the slider.
    $(".ui-slider input.change-step").focus(function() {
        $(this).attr("step","1");
        console.log("Step: 1");
    })
    $(".ui-slider .ui-slider-handle").focus(function() {
        $(this).parent().parent().children("input.change-step").attr("step","5");
        console.log("Step: 5");
    })

    // Work with the slider.
    ko.bindingHandlers.slider = {
        init: function(element, valueAccessor) {
            var val = valueAccessor()();
            $(element).slider({
                value: val,
                step: 1,
                slide: function(event, ui) {
                    valueAccessor()(ui.value);
                }
            });
        },
        update: function(element, valueAccessor) {
            $(element).slider("option", "value", valueAccessor()());
        }
    };

});


var LumberItemMetric = function(bfm) {
    var self = this;

    // Values for the calculation.
    self.width = ko.observable(); // Inches
    self.thickness = ko.observable(); // Inches
    self.length = ko.observable(); // Feet
    self.quantity = ko.observable(); // Count
    self.pricePerMeter3 = ko.observable(); // Count
    self.totalBft = ko.observable(); // m3
    self.totalPrice = ko.observable(); // $
    self.pieceBft = ko.observable(); // m3
    self.piecePrice = ko.observable(); // $

    self.deleteItem = function() {
        boardFeetMetricModel.lumberItems.remove(self);
        boardFeetMetricModel.saveLumberItems();
    };

    self.load = function(item) {
        self.width(item.width);
        self.thickness(item.thickness);
        self.length(item.length);
        self.quantity(item.quantity);
        self.pricePerMeter3(item.pricePerMeter3);
        self.totalBft(item.totalBft);
        self.totalPrice(item.totalPrice);
        self.pieceBft(item.pieceBft);
        self.piecePrice(item.piecePrice);
    };
    self.loadKO = function(item) {
        self.width(item.width());
        self.thickness(item.thickness());
        self.length(item.length());
        self.quantity(item.quantity());
        self.pricePerMeter3(item.pricePerMeter3());
        self.totalBft(item.totalBft());
        self.totalPrice(item.totalPrice());
        self.pieceBft(item.pieceBft());
        self.piecePrice(item.piecePrice());
    };

};