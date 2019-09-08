// Handles the cutlist logic.
// Must call this so that we don't get more than one pageinit called.
$(document).delegate("#pageCutListMetric", "pageinit", function() {
	// Model for calculations and storing data.
	var CutListModel = function() {
		var self = this;
		
		self.kerf = ko.observable(Number(window.localStorage.getItem("MetricKerf")) || 3);
		self.thickness = ko.observable(Number(window.localStorage.getItem("MetricThickness")) || 38);
		self.total = ko.observable(Number(window.localStorage.getItem("MetricTotal")) || 300);
		self.flitch = ko.observable(Number(window.localStorage.getItem("MetricFlitch")) || 0);
		
		self.cutList = ko.observableArray();
		
		self.calculate = function() {
			self.cutList.removeAll();

			var index = 1;
			
			// Calculate everything in milimeters.
			// Add the starting spot.
			var currentCut = Number(self.flitch());
			// Add the flitch cut if necessary
			if (currentCut > 0){ 
			    if (settingsModel.sideOfBlade() == 'top') {
			        currentCut += Number(self.kerf());
			    }
			    self.cutList.push(textFromMm(currentCut, index));
			    if (settingsModel.sideOfBlade() == 'bottom') {
			        currentCut += Number(self.kerf());
			    }
			    index++;
			}

			// Loop and figure out all the cuts.			
			while (currentCut <= Number(self.total())){
				currentCut += Number(self.thickness());
				if (settingsModel.sideOfBlade() == 'top') {
					currentCut += Number(self.kerf());
				}
				if (currentCut > 0){ 
				    self.cutList.push(textFromMm(currentCut, index));
					index++;
				}
				if (settingsModel.sideOfBlade() == 'bottom') {
					currentCut += Number(self.kerf());
				}
			}
			
			self.cutList.reverse();
			
		};


		// Save the values when changed.	
		self.kerf.subscribe(function(value) {
		    window.localStorage.setItem("MetricKerf", value);
			self.calculate();
		});
		self.thickness.subscribe(function(value) {
		    window.localStorage.setItem("MetricThickness", value);
			self.calculate();
		});
		self.total.subscribe(function(value) {
		    window.localStorage.setItem("MetricTotal", value);
			self.calculate();
		});
		self.flitch.subscribe(function(value) {
		    window.localStorage.setItem("MetricFlitch", value);
			self.calculate();
		});
		
		function textFromMm(x, index){
			var mm = Math.floor(x);
			var result = mm + "mm";
		
			return {measurement: result, id: "Index" + index, checked:false};
		}

	};
			
   	var cutListModel = new CutListModel();
	
	ko.applyBindings(cutListModel, document.getElementById("pageCutListMetric"));


});

ko.bindingHandlers.checkbox = {
	init: function(element){
        $(element).checkboxradio();
        //$(element).attr("checked", false).checkboxradio("refresh");
	},
    update: function(element, valueAccessor) {
        $(element).checkboxradio("refresh");
    }
};
