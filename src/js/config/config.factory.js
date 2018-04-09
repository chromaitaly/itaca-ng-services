/**
 * Servizio per le impostazioni dell'applicazione
 */
(function() {
    'use strict';
    
    angular.module("itaca.services").factory('Config', ConfigFactory);
    
    /* @ngInject */
    function ConfigFactory($resource, $q) {			
    	var $$service = {};
    	
    	$$service.url = "/api/rs/secure/config";
    	
    	var methods = {
    		amazon: {method: "GET", url: $$service.url + "/amz"},
    		creditCard: {method: "GET", url: $$service.url + "/cc"}
    	};
    	
    	$$service.API = $resource($$service.url, null, methods);
    	
    	$$service.amazon = function() {
    		var deferred = $q.defer();
    		
    		this.API.amazon().$promise.then(function(response) {
    			deferred.resolve(response);
    			
    		}, function(response) {
    			deferred.reject(response.data && response.data.message ? response.data.message : "Error getting amz config");
    		});

    		return deferred.promise;
    	};
    	
    	$$service.creditCard = function() {
    		var deferred = $q.defer();
    		
    		this.API.creditCard().$promise.then(function(response) {
    			deferred.resolve(response);
    			
    		}, function(response) {
    			deferred.reject(response.data && response.data.message ? response.data.message : "Error getting credit card config");
    		});

    		return deferred.promise;
    	};
    	
    	return $$service;
    }
})();