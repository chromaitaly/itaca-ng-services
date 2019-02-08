(function() {
	'use strict';
	
	angular.module("itaca.services").factory('GoogleAPI', GoogleApi); 
    
    /* @ngInject */
    function GoogleApi($http, $resource, $q, $log) {			
		var $$service = {};
		
		$$service.autocompleteSvc = new google.maps.places.AutocompleteService();
		$$service.placesSvc = new google.maps.places.PlacesService(document.createElement('div'));
		$$service.geocoderSvc = new google.maps.Geocoder();
		
		var methods = {
			get: {method: "GET", url: $$service.url}
		};
	
		$$service.cities = function(filter, nationalityAlpha2Code) {
			var deferred = $q.defer();
	
			$$service.autocompleteSvc.getPlacePredictions({ input: filter, types: ['(cities)'], componentRestrictions: {country: nationalityAlpha2Code} }, function(predictions, status) {
			    if (status != google.maps.places.PlacesServiceStatus.OK) {
			    	deferred.reject("Error getting cities: " + status);
			    	
			    } else {
			    	deferred.resolve(predictions);
			    }
			});
	
			return deferred.promise;
		};
		
		$$service.places = function(filter, nationalityAlpha2Code) {
			var deferred = $q.defer();
	
			$$service.autocompleteSvc.getPlacePredictions({ input: filter, types: ['(regions)'], componentRestrictions: {country: nationalityAlpha2Code} }, function(predictions, status) {
			    if (status != google.maps.places.PlacesServiceStatus.OK) {
			    	deferred.reject("Error getting cities: " + status);
			    	
			    } else {
			    	deferred.resolve(predictions);
			    }
			});
	
			return deferred.promise;
		};
		
		$$service.addresses = function(filter, nationalityAlpha2Code) {
			var deferred = $q.defer();
	
			$$service.autocompleteSvc.getPlacePredictions({ input: filter, types: ['address'], componentRestrictions: {country: nationalityAlpha2Code} }, function(predictions, status) {
			    if (status != google.maps.places.PlacesServiceStatus.OK) {
			    	deferred.reject("Error getting addresses: " + status);
			    	
			    } else {
			    	deferred.resolve(predictions);
			    }
			});
			
			return deferred.promise;
		};
		
		// esercizi commerciali
		$$service.business = function(filter, nationalityAlpha2Code) {
			var deferred = $q.defer();
	
			$$service.autocompleteSvc.getPlacePredictions({ input: filter, types: ['establishment'], componentRestrictions: {country: nationalityAlpha2Code} }, function(predictions, status) {
			    if (status != google.maps.places.PlacesServiceStatus.OK) {
			    	deferred.reject("Error getting establishment: " + status);
			    	
			    } else {
			    	deferred.resolve(predictions);
			    }
			});
			
			return deferred.promise;
		};
		
		// zipcode
		$$service.zipCodes = function(filter, nationalityAlpha2Code) {
			var deferred = $q.defer();
	
			$$service.geocoderSvc.geocode({componentRestrictions: {country: nationalityAlpha2Code, postalCode: filter}}).$promise.then(function(response) {
				deferred.resolve(response.results);
			}, function(response) {
				deferred.reject(response.data && response.data.message ? response.data.message : "Error getting zip codes");
			});		
	
			return deferred.promise;
		};
		
		// geolocation
		$$service.latLong = function(address){
			var deferred = $q.defer();
			
			$$service.geocoderSvc.geocode( { address: address}, function(results, status) {
			      if (status == google.maps.GeocoderStatus.OK) {
			    	  deferred.resolve(results[0]);
			      } else {
			    	  deferred.reject("Error getting latlong : " + status);
			      }
			}, function(response) {
				$log.error("Error getting latlong: " + response.statusText + " (code: " + response.status + ")");
				deferred.reject("Error getting latlong");
			});
			
			return deferred.promise;		
		};
		
		// place details
		$$service.placeDetails = function(placeId){
			var deferred = $q.defer();
			
			$$service.placesSvc.getDetails({placeId: placeId}, function callback(place, status) {
			  if (status == google.maps.places.PlacesServiceStatus.OK) {
				  deferred.resolve(place);
			  } else {
		    	  deferred.reject("Error getting place : " + status);
		      }
			}, function(response) {
				$log.error("Error getting place: " + response.statusText + " (code: " + response.status + ")");
				deferred.reject("Error getting place");
			});
			
			return deferred.promise;
		};
		
		// airports
		$$service.airportsByAddress = function(address) {
			var deferred = $q.defer();
			
			if(!address.geometry.location){
				$$service.latLong(address).then(function(data){
		
					deferred.resolve($$service.airportsByLatlong(data));
					
				},function(error){
					 deferred.reject(error);
				});
				
			}else{
				
				deferred.resolve($$service.airportsByLatlong(address));
			}

			return deferred.promise;
		};
		
		$$service.airportsByLatlong = function(latLong) {
			var deferred = $q.defer();
		
			var request = {
				location: {lat: latLong.geometry.location.lat(), lng: latLong.geometry.location.lng()},
			    radius: 50000,
			    query : 'airport '+ latLong.address_components[0].long_name +' principal',
			    type: 'airport'
			};

			$$service.placesSvc.textSearch(request, function(results, status){
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					var airports = [];
					
				    for (var i = 0; i < results.length; i++) {
				    	var result = results[i];
				    	if(result.types.length == 3 && !result.permanently_closed){
				    	
					    	var airport = {};
					    	
					    	// aggiungere city e country corretti
					    	airport.country = "";
					    	airport.city 	= "";
					    	airport.address = result.vicinity; 
					    	airport.name 	= result.name;
					    	airport.lat		= result.geometry.location.lat();
					    	airport.lng		= result.geometry.location.lng();
					    	airport.type	= "AIRPORT";
					    	airports.push(airport);	
				    	}
				    }
				    
				    deferred.resolve(airports);
				    
				} else {
					 deferred.reject("Error getting airports : " + status);
				}
			});

			return deferred.promise;
		};
		
	// train_station
		$$service.trainStationsByAddress = function(address) {
			var deferred = $q.defer();
			
			if(!address.geometry.location){
				$$service.latLong(address).then(function(data){
		
					deferred.resolve($$service.trainStationsByLatlong(data));
					
				},function(error){
					 deferred.reject(error);
				});
				
			} else {			
				deferred.resolve($$service.trainStationsByLatlong(address));
			}

			return deferred.promise;
		};
		
		$$service.trainStationsByLatlong = function(latLong) {
			var deferred = $q.defer();
			
			var request = {
				location: {lat: latLong.geometry.location.lat(), lng: latLong.geometry.location.lng()},
			    radius: 50000,
			    query : 'train station '+ latLong.address_components[0].long_name +' principal',
			    type: 'train_station'
			};

			$$service.placesSvc.textSearch(request, function(results, status){
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					var trainStations = [];
					
				    for (var i = 0; i < results.length; i++) {
				    	var result = results[i];

				    	if(!result.permanently_closed){
					    	var trainStation = {};
					    	
					    	// aggiungere city e country corretti
					    	trainStation.country = "";
					    	trainStation.city 	 = "";
					    	trainStation.address = result.vicinity; 
					    	trainStation.name 	 = result.name;
					    	trainStation.lat 	 = result.geometry.location.lat();
					    	trainStation.lng 	 = result.geometry.location.lng();
					    	trainStation.type	 = "TRAIN_STATION";
					    	trainStations.push(trainStation);
				    	}
				    }
				    
				    deferred.resolve(trainStations);
				    
				} else {
					 deferred.reject("Error getting train stations: " + status);
				}
			});

			return deferred.promise;
		};
		
		return $$service;
    }
})();
