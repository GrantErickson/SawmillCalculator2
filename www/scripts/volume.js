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

var volumeModel;

$(document).delegate("#pageVolume", "pageinit", function() {
	// Model for calculations and storing data.
	var VolumeModel = function() {
		var self = this;
		
		// Values for the calculation.
		self.length = ko.observable(Number(window.localStorage.getItem("VolumeLength")) || 16);  // Feet
		self.diameter = ko.observable(Number(window.localStorage.getItem("VolumeDiameter")) || 12);  // Inches
		self.quantity = ko.observable(Number(window.localStorage.getItem("VolumeQuantity")) || 1);  // Count

		// Load the array of saved items.
		var oldItemsJson = window.localStorage.getItem("VolumeItems") || "[]";
		var oldItems = $.parseJSON(oldItemsJson);
		self.items = ko.observableArray([]); // List of items. 
		for (i in oldItems){
			var item = new VolumeItem();
			item.load(oldItems[i]);
			self.items.push(item);
		}


		// Calculate the volumes
		self.doyle = ko.computed(function() {
			var l = Number(self.length());
			var d = Number(self.diameter());
			var q = Number(self.quantity());
			
			var value = (d - 4) * (d - 4) * (l / 16);
			value = value * q;
			return Math.round(value);
		});
	
		self.scribner = ko.computed(function() {
			var l = Number(self.length());
			var d = Number(self.diameter());
			var q = Number(self.quantity());
			
			var value = (.79 * d * d - 2 * d - 4) * l / 16;
			value = value * q;
			return Math.round(value);
		});
	
		self.international = ko.computed(function() {
			var l = Number(self.length());
			var d = Number(self.diameter());
			var q = Number(self.quantity());
			
			var value = 0.04976191 * l * d * d + 
			            0.006220239 * l * l * d - 
			            0.1854762 * l * d + 
			            0.0002591767 * l * l * l - 
			            0.01159226 * l * l + 
			            0.04222222 * l;
			value = value * q;
			return Math.round(value);
		});
		
		self.roy = ko.computed(function() {
			var l = Number(self.length());
			var d = Number(self.diameter());
			var q = Number(self.quantity());
			
			var value = (d-1) * (d-1) * 0.5 * l / 10;
			value = value * q;
			return Math.round(value);
		});
		
	
		// Save the values. 
		self.length.subscribe(function(value) {
			window.localStorage.setItem("VolumeLength",value);
		});
		self.diameter.subscribe(function(value) {
			window.localStorage.setItem("VolumeDiameter",value);
		});
		self.quantity.subscribe(function(value) {
			window.localStorage.setItem("VolumeQuantity",value);
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
			var item = new VolumeItem();
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
			window.localStorage.setItem("VolumeItems", ko.toJSON(self.items));			
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
							'<td class="left">' + index + '</td>' +
							'<td>' + this.quantity() + '</td>' +
							'<td>' + this.diameter() + '"</td>' +
							'<td>' + this.length() + "'</td>" +
							'<td>' + doyle.formatBft() + '</td>' +
							'<td>' + scribner.formatBft() + '</td>' +
							'<td>' + international.formatBft() + '</td>' +
							'<td>' + roy.formatBft() + '</td>' +
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
					'<th>' + Number(totalDoyle).formatBft() +'</th>' +
					'<th>' + Number(totalScribner).formatBft() +'</th>' +
					'<th>' + Number(totalInternational).formatBft() +'</th>' +
					'<th>' + Number(totalRoy).formatBft() +'</th>' +
					'</tr>' +
					'</tfoot>\n';
			text += '</table>\n';

            commonSendEmail(subject, text, "LogVolume.pdf");
			//window.location.href = 'mailto:?subject=' + subject + '&body=' + encodeURIComponent(text);
			
			return;

		};


	};
			
	// Create the model and apply it.
   	volumeModel = new VolumeModel();
	
	ko.applyBindings(volumeModel, document.getElementById("pageVolume"));

	$("#volumeLength").slider("refresh");
	$("#volumeDiameter").slider("refresh");
	$("#volumeQuantity").slider("refresh");

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


var VolumeItem = function(bfm) {
	var self = this;
	
	// Values for the calculation.
	self.diameter = ko.observable();  // Inches
	self.length = ko.observable();  // Feet
	self.quantity = ko.observable();  // Count
	self.doyle = ko.observable();  // bft
	self.scribner = ko.observable();  // bft
	self.international = ko.observable();  // bft
	self.roy = ko.observable();  // bft
	
	self.deleteItem = function(){
		volumeModel.items.remove(self);
		volumeModel.saveItems();
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


