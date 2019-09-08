// Standard settings code so everyone can get to the settings.
// Handles the settings logic.
var SettingsModel = function() {
	var self = this;
	
	// Settings to save.
	self.sideOfBlade = ko.observable(window.localStorage.getItem("sideOfBlade") || "bottom"); 
	// Settings to save.
	self.maxQuantity = ko.observable(window.localStorage.getItem("maxQuantity") || "100");

	// Save the values. 
	self.sideOfBlade.subscribe(function(value) {
		window.localStorage.setItem("sideOfBlade",value);
	});
	
	self.maxQuantity.subscribe(function(value) {
		window.localStorage.setItem("maxQuantity",value);
	});
};
			
// Create the model and apply it.
var settingsModel = new SettingsModel();





 
