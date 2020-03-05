// Handles the board feet logic.
// Must call this so that we don't get more than one pageinit called.

// https://www.extension.purdue.edu/extmedia/FNR/FNR-191.pdf
// Doyle: ((dia-4)*(dia-4))*(length/16)
// dia: in, len: ft, bdft
// Scribner: (.79D2 -2D -4)L/16
// International
// 0.04976191*L*D*D + 0.006220239*L*L*D – 0.1854762*L*D + 0.0002591767*L*L*L – 0.01159226*L*L + 0.04222222*L
// BF (for 4-foot lengths) = 0.199D2  – 0.642D
// BF (for 8-foot lengths) = 0.398D2 – 1.086D – 0.271
// BF (for 12-foot lengths) = 0.597D2 – 1.330D – 0.715
// BF (for 16-foot lengths) = 0.796D2 – 1.375D – 1.230
// BF (for 20-foot lengths) = 0.995D2 – 1.221D – 1.719

// Volume
// http://www.fs.fed.us/pnw/pubs/uncaptured/pnw_rn417.pdf
// Taper: 1/2" per 4'
// 0.005454/3 * (ds*ds + dl*dl + ds*dl) * l

var volumeMetricModel;

$(document).delegate("#pageVolumeMetric", "pageinit", function() {
	// Model for calculations and storing data.
	var VolumeMetricModel = function() {
		var self = this;
		var mmPerIn = 25.4;
		var mPerFt = .3048;
		var m3PerBft = 0.00235974;

		// Values for the calculation.
		self.length = ko.observable(Number(window.localStorage.getItem("VolumeMetricLength")) || 36);  // mm
		self.diameter = ko.observable(Number(window.localStorage.getItem("VolumeMetricDiameter")) || 4);  // m
		self.quantity = ko.observable(Number(window.localStorage.getItem("VolumeMetricQuantity")) || 1);  // Count

		// Load the array of saved items.
		var oldItemsJson = window.localStorage.getItem("VolumeMetricItems") || "[]";
		var oldItems = $.parseJSON(oldItemsJson);
		self.items = ko.observableArray([]); // List of items. 
		for (i in oldItems){
			var item = new VolumeMetricItem();
			item.load(oldItems[i]);
			self.items.push(item);
		}


		// Calculate the volumes
		self.doyle = ko.computed(function() {
			var l = Number(self.length())/mPerFt;
			var d = Number(self.diameter())/mmPerIn;
			var q = Number(self.quantity());
			
			var value = ((d - 4) * (d - 4) * (l / 16));
			value = value * q * m3PerBft;
			return value.round(3);
		});
	
		self.scribner = ko.computed(function() {
			var l = Number(self.length())/mPerFt;
			var d = Number(self.diameter())/mmPerIn;
			var q = Number(self.quantity());
			
			var value = (.79 * d * d - 2 * d - 4) * l / 16;
			value = value * q* m3PerBft;
			return value.round(3);
		});
	
		self.international = ko.computed(function() {
			var l = Number(self.length())/mPerFt;
			var d = Number(self.diameter())/mmPerIn;
			var q = Number(self.quantity());
			
			var value = 0.04976191 * l * d * d + 
			            0.006220239 * l * l * d - 
			            0.1854762 * l * d + 
			            0.0002591767 * l * l * l - 
			            0.01159226 * l * l + 
			            0.04222222 * l;
			value = value * q* m3PerBft;
			return value.round(3);
		});
		
		self.roy = ko.computed(function() {
			var l = Number(self.length())/mPerFt;
			var d = Number(self.diameter())/mmPerIn;
			var q = Number(self.quantity());
			
			var value = (d-1) * (d-1) * 0.5 * l / 10;
			value = value * q * m3PerBft;
			return value.round(3);
		});
		
	
		// Save the values. 
		self.length.subscribe(function(value) {
			window.localStorage.setItem("VolumeMetricLength",value);
		});
		self.diameter.subscribe(function(value) {
			window.localStorage.setItem("VolumeMetricDiameter",value);
		});
		self.quantity.subscribe(function(value) {
			window.localStorage.setItem("VolumeMetricQuantity",value);
		});
		
		self.grandTotalDoyle = ko.computed(function() {
            var result = 0;
            for (var item in self.items()) {
                result += self.items()[item].doyle();
            }
            return result;
        });
		self.grandTotalScribner = ko.computed(function() {
            var result = 0;
            for (var item in self.items()) {
                result += self.items()[item].scribner();
            }
            return result;
        });
		self.grandTotalInternational = ko.computed(function() {
            var result = 0;
            for (var item in self.items()) {
                result += self.items()[item].international();
            }
            return result;
        });
		self.grandTotalRoy = ko.computed(function() {
            var result = 0;
            for (var item in self.items()) {
                result += self.items()[item].roy();
            }
            return result;
        });
		
		// ******** Code to handle Volume Items.
		self.addItem = function() {
			var item = new VolumeMetricItem();
			item.loadKO(self);
			self.items.push(item);
			self.saveItems();
		};
		
		self.clearItems = function() {
			var r = confirm("Do you really want to clear the list?");
			if (r==true) {
				self.items.removeAll();
				self.saveItems();
		  	}
		};
		
		self.saveItems = function() {
			//alert(ko.toJSON(self.lumberItems));
			window.localStorage.setItem("VolumeMetricItems", ko.toJSON(self.items));			
		};
		
		self.sendEmail = function() {
			var subject = 'Log Volume List'; 
			var text = '';
			var totalDoyle = 0;
			var totalScribner = 0;
			var totalInternational = 0;
			var totalRoy = 0;
			
			text = pdfStyles;		
			
			text += '<table>\n';
			// Header
			text += '<thead>\n' +
						'<tr>' +
							'<th class="left">#</th>' +
							'<th>Quantity</th>' +
							'<th>Diameter</th>' +
							'<th>Length</th>' +
							'<th>Doyle</th>' +
							'<th>Scribner</th>' +
							"<th>Int'l</th>" +
							'<th>ROY</th>' +
						'</tr>\n' + 
					'</thead>\n';
			
			// Body
			text += '<tbody>\n';
			var index = 0;
			$(self.items()).each(function(){
				index++;
				var doyle = Number(this.doyle());
				var scribner = Number(this.scribner());
				var international = Number(this.international());
				var roy = Number(this.roy());
				text += '  <tr>' +
							'<td class="left">' + index + '. </td>' +
							'<td>' + this.quantity() + '</td>' +
							'<td>' + this.diameter() + 'mm</td>' +
							'<td>' + this.length() + "m</td>" +
							'<td>' + doyle.formatM3() + '</td>' +
							'<td>' + scribner.formatM3() + '</td>' +
							'<td>' + international.formatM3() + '</td>' +
							'<td>' + roy.formatM3() + '</td>' +
						'</tr>\n';
				totalDoyle += doyle;
				totalScribner += scribner;
				totalInternational += international;
				totalRoy += roy;
			});
			text += '</tbody>\n';
			
			// Footer
			text += '<tfoot>\n' + 
					'  <tr>' + 
					'<th></th>' +
					'<th></th>' +
					'<th></th>' +
					'<th></th>' +
					'<th>' + Number(totalDoyle).formatM3() +'</th>' +
					'<th>' + Number(totalScribner).formatM3() +'</th>' +
					'<th>' + Number(totalInternational).formatM3() +'</th>' +
					'<th>' + Number(totalRoy).formatM3() +'</th>' +
					'</tr>' +
					'</tfoot>\n';
			text += '</table>\n';

            commonSendEmail(subject, text, "LogVolume.pdf");
			//window.location.href = 'mailto:?subject=' + subject + '&body=' + encodeURIComponent(text);
			
			return;

		};


	};
			
	// Create the model and apply it.
   	volumeMetricModel = new VolumeMetricModel();
	
	ko.applyBindings(volumeMetricModel, document.getElementById("pageVolumeMetric"));

	$("#volumeLengthMetric").slider("refresh");
	$("#volumeDiameterMetric").slider("refresh");
	$("#volumeQuantityMetric").slider("refresh");

	// Turn off input fields
	$(".calculations input").textinput('disable');

	// Work with the slider.
	ko.bindingHandlers.slider = {
	    init: function (element, valueAccessor) {
	        var val = valueAccessor()();
	        $(element).slider(
	                            {
	                                value: val,
	                                step: 1,
	                                slide: function (event, ui) {
	                                    valueAccessor()(ui.value);
	                                }
	                            });
	    },
	    update: function (element, valueAccessor) {
	        $(element).slider("option", "value", valueAccessor()());
	    }
	};
});


var VolumeMetricItem = function(bfm) {
	var self = this;
	
	// Values for the calculation.
	self.diameter = ko.observable();  // mm
	self.length = ko.observable();  // m
	self.quantity = ko.observable();  // Count
	self.doyle = ko.observable();  // m3
	self.scribner = ko.observable();  // m3
	self.international = ko.observable();  // m3
	self.roy = ko.observable();  // m3
	
	self.deleteItem = function(){
		volumeMetricModel.items.remove(self);
		volumeMetricModel.saveItems();
	};
	
	self.load = function(item){
		self.diameter(item.diameter);
		self.length(item.length);
		self.quantity(item.quantity);
		self.doyle(item.doyle);
		self.scribner(item.scribner);
		self.international(item.international);
		self.roy(item.roy);
	};
	self.loadKO = function(item){
		self.diameter(item.diameter());
		self.length(item.length());
		self.quantity(item.quantity());
		self.doyle(item.doyle());
		self.scribner(item.scribner());
		self.international(item.international());
		self.roy(item.roy());
	};
};


