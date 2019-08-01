/**
 * Servizio per le info dell'applicazione
 */
(function() {
    "use strict";
    
    angular.module("itaca.services").factory("About", AboutFactory);
    
    /* @ngInject */
    function AboutFactory($resource, $q) {			
    	var $$service = {};
    	
    	$$service.url = "/api/rs/public/about";
    	
    	var methods = {
			get: {method: "GET", url: $$service.url},
			reservationSources: {method: "GET", url: $$service.url + "/reservations/sources"},
			reservationChannelSources: {method: "GET", url: $$service.url + "/reservations/channels"},
		};
		
    	$$service.API = $resource($$service.url, null, methods);
    	
    	$$service.get = function() {
    		var deferred = $q.defer();
    		
    		this.API.get().$promise.then(function(response) {
    			deferred.resolve(response);
    		}, function(response) {
    			deferred.reject(response.data && response.data.message ? response.data.message : "Error getting application info");
    		});

    		return deferred.promise;
    	};
    	
    	$$service.reservationSources = function() {
    		var deferred = $q.defer();
    		
    		this.API.reservationSources().$promise.then(function(response) {
    			deferred.resolve(response);
    		}, function(response) {
    			deferred.reject(response.data && response.data.message ? response.data.message : "Error getting reservation sources");
    		});

    		return deferred.promise;
    	};
    	
    	$$service.reservationChannelSources = function() {
    		var deferred = $q.defer();
    		
    		this.API.reservationChannelSources().$promise.then(function(response) {
    			deferred.resolve(response);
    		}, function(response) {
    			deferred.reject(response.data && response.data.message ? response.data.message : "Error getting active reservation channel sources");
    		});

    		return deferred.promise;
    	};
    	
    	return $$service;
    }
})();