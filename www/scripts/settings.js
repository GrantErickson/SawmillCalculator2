// Standard settings code so everyone can get to the settings.
// Handles the settings logic.
var SettingsModel = function() {
	var self = this;
	
	// Settings to save.
	self.sideOfBlade = ko.observable(window.localStorage.getItem("sideOfBlade") || "bottom"); 
	self.maxQuantity = ko.observable(window.localStorage.getItem("maxQuantity") || "100");
	self.moneySymbol = ko.observable(window.localStorage.getItem("moneySymbol") || "$");
	self.moneySymbolLocation = ko.observable(window.localStorage.getItem("moneySymbolLocation") || "before");

	// Save the values. 
	self.sideOfBlade.subscribe(function(value) {
		window.localStorage.setItem("sideOfBlade",value);
	});
	self.maxQuantity.subscribe(function(value) {
		window.localStorage.setItem("maxQuantity",value);
	});
	self.moneySymbol.subscribe(function(value) {
		window.localStorage.setItem("moneySymbol",value);
	});
	self.moneySymbolLocation.subscribe(function(value) {
		window.localStorage.setItem("moneySymbolLocation",value);
	});
};
			
// Create the model and apply it.
var settingsModel = new SettingsModel();





 
