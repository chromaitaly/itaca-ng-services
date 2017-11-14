/**
 * Wrapper per le API di Google
 */
(function() {
    'use strict';
    
    angular.module("itaca.services").factory('GoogleAPI', GoogleFactory);
    
    /* @ngInject */
    function GoogleFactory($http, $resource, $q, $log) {			
    	var $$service = {};
    	
    	$$service.autocompleteSvc = new google.maps.places.AutocompleteService();
    	$$service.placesSvc = new google.maps.places.PlacesService(document.createElement('div'));
    	$$service.geocoderSvc = new google.maps.Geocoder();

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
    	
    	$$service.addresses = function(filter, nationalityAlpha2Code) {
    		var deferred = $q.defer();

    		this.autocompleteSvc.getPlacePredictions({ input: filter, types: ['address'], componentRestrictions: {country: nationalityAlpha2Code} }, function(predictions, status) {
    		    if (status != google.maps.places.PlacesServiceStatus.OK) {
    		    	deferred.reject("Error getting addresses: " + status);
    		    	
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
    		      if (data.status == "OK") {
    		    	  deferred.resolve(data.results[0]);
    		      } else {
    		    	  deferred.reject("Error getting latlong : " + data.status);
    		      }
    		}, function(error) {
    			$log.error("Error getting latlong: " + response.statusText + " (code: " + response.status + ")");
    			deferred.reject("Error getting latlong");
    		});
    		
    		return deferred.promise;		
    	};
    	
    	return $$service;
    }
})();
