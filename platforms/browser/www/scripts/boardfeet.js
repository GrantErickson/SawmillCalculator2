// WoodType Enum
var WoodTypes = {
    Softwood: "soft",
    Hardwood: "hard"
};


// Handles the board feet logic.
// Must call this so that we don't get more than one pageinit called.
var boardFeetModel;
$(document).delegate("#pageBoardFeet", "pageinit", function() {
    // Model for calculations and storing data.
    var BoardFeetModel = function() {
        var self = this;

        self.maxQuantity = ko.observable(window.localStorage.getItem("maxQuantity") || "100");

        // Values for the calculation.
        self.width = ko.observable(Number(window.localStorage.getItem("BfWidth")) || 6); // Inches
        self.thickness = ko.observable(Number(window.localStorage.getItem("BfThickness")) || 2); // Inches
        self.length = ko.observable(Number(window.localStorage.getItem("BfLength")) || 16); // Feet
        self.quantity = ko.observable(Number(window.localStorage.getItem("BfQuantity")) || 1); // Count
        self.pricePer1000 = ko.observable(Number(window.localStorage.getItem("BfPricePer1000")) || 1); // Count
        self.woodType = ko.observable(window.localStorage.getItem("BfWoodType") || WoodTypes.Softwood); // 0: Softwood, 1: Hardwood.

        var oldItems = window.localStorage.getItem("LumberItems") || "[]";

        var items = $.parseJSON(oldItems);
        self.lumberItems = ko.observableArray([]); // List of items. 

        for (i in items) {
            var item = new LumberItem();
            item.load(items[i]);
            self.lumberItems.push(item);
        }


        // Calculate the Total BFT
        self.totalBft = ko.computed(function() {
            var value = Number(self.width()) *
                Number(self.thickness()) *
                Number(self.length()) *
                Number(self.quantity()) /
                12;
            if (self.woodType() == WoodTypes.Softwood) {
                // Nothing changes for softwoods because the thickness is in inches.
            } else if (self.woodType() == WoodTypes.Hardwood) {
                // Hardwoods are in quarters
                value = value / 4;
            }
            return Math.round(value * 100) / 100;
        });
        // Calculate the Total Price
        self.totalPrice = ko.computed(function() {
            var value = Number(self.totalBft()) *
                Number(self.pricePer1000()) /
                1000;
            return Math.round(value * 100) / 100;
        });
        self.pieceBft = ko.computed(function() {
            return round(self.totalBft() / self.quantity(), 2);
        }); // bft
        self.piecePrice = ko.computed(function() {
            return round(self.totalPrice() / self.quantity(), 2); // $
        });
        // Return the quarters for the wood thickness if hardwood is selected.
        self.thicknessText = ko.computed(function() {
            var thickness = self.thickness();
            if (self.woodType() == WoodTypes.Softwood) {
                return "Nominal Thickness in inches:";
            } else if (self.woodType() == WoodTypes.Hardwood) {
                // Hardwoods are in quarters
                return "Thickness in Quarters of inches:";
            }
            return self.thickness();
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
            window.localStorage.setItem("BfWidth", value);
        });
        self.thickness.subscribe(function(value) {
            window.localStorage.setItem("BfThickness", value);
        });
        self.length.subscribe(function(value) {
            window.localStorage.setItem("BfLength", value);
        });
        self.quantity.subscribe(function(value) {
            window.localStorage.setItem("BfQuantity", value);
        });
        self.pricePer1000.subscribe(function(value) {
            window.localStorage.setItem("BfPricePer1000", value);
        });
        self.woodType.subscribe(function(value) {
            window.localStorage.setItem("BfWoodType", value);
        });


        // Calculated values. 
        self.addLumberItem = function() {
            var item = new LumberItem();
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
            window.localStorage.setItem("LumberItems", ko.toJSON(self.lumberItems));
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
                '<th>Bft/piece</th>' +
                '<th>Total Bft</th>' +
                '<th>$/1000</th>' +
                '<th>$/piece</th>' +
                '<th>Total</th>\n' +
                '</tr>' +
                '</thead>\n';

            // Body
            text += '<tbody>\n';
            var index = 0;
            $(self.lumberItems()).each(function() {
                index++;
                var pricePer1000 = Number(this.pricePer1000()).round(2);
                var piecePrice = Number(this.piecePrice()).round(2);
                var totalPrice = Number(this.totalPrice()).round(2);
                var totalBft = Number(this.totalBft()).round(2);
                var pieceBft = Number(this.pieceBft()).round(2);
                text += '  <tr>' +
                    '<td class="left">' + index + '. </td>' +
                    '<td>' + this.quantity() + '</td>' +
                    '<td>' + this.thickness() + ((this.woodType() == WoodTypes.Hardwood) ? '/4' : '') + '"</td>' +
                    '<td>' + this.width() + '"</td>' +
                    '<td>' + this.length() + "'</td>" +
                    '<td>' + pieceBft.formatBft2() + '</td>' +
                    '<td>' + totalBft.formatBft2() + '</td>' +
                    '<td>$' + pricePer1000.formatMoney() + '</td>' +
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
                '<th>' + totalBftSum.formatBft2() + '</th>' +
                '<th></th>' +
                '<th></th>' +
                '<th>$' + totalPriceSum.formatMoney() + '</th>' +
                '</tr>' +
                '</tfoot>\n';
            text += '</table>\n';

            commonSendEmail(subject, text, "BoardFeet.pdf");
            //window.location.href = 'mailto:?subject=' + subject + '&body=' + encodeURIComponent(text);

            return;

        };

    };

    // Create the model and apply it.
    boardFeetModel = new BoardFeetModel();

    ko.applyBindings(boardFeetModel, document.getElementById("pageBoardFeet"));

    $("#bfWidth").slider("refresh");
    $("#bfThickness").slider("refresh");
    $("#bfLength").slider("refresh");
    $("#bfQuantity").slider("refresh");


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


var LumberItem = function(bfm) {
    var self = this;

    // Values for the calculation.
    self.width = ko.observable(); // Inches
    self.thickness = ko.observable(); // Inches
    self.length = ko.observable(); // Feet
    self.quantity = ko.observable(); // Count
    self.pricePer1000 = ko.observable(); // Count
    self.totalBft = ko.observable(); // bft
    self.totalPrice = ko.observable(); // $
    self.pieceBft = ko.observable(); // bft
    self.piecePrice = ko.observable(); // $
    self.woodType = ko.observable(WoodTypes.Softwood); // Type

    self.deleteItem = function() {
        boardFeetModel.lumberItems.remove(self);
        boardFeetModel.saveLumberItems();
    };

    self.load = function(item) {
        self.width(item.width);
        self.thickness(item.thickness);
        self.length(item.length);
        self.quantity(item.quantity);
        self.pricePer1000(item.pricePer1000);
        self.totalBft(item.totalBft);
        self.totalPrice(item.totalPrice);
        self.pieceBft(item.pieceBft);
        self.piecePrice(item.piecePrice);
        self.woodType(item.woodType);
    };
    self.loadKO = function(item) {
        self.width(item.width());
        self.thickness(item.thickness());
        self.length(item.length());
        self.quantity(item.quantity());
        self.pricePer1000(item.pricePer1000());
        self.totalBft(item.totalBft());
        self.totalPrice(item.totalPrice());
        self.pieceBft(item.pieceBft());
        self.piecePrice(item.piecePrice());
        self.woodType(item.woodType());
    };

};