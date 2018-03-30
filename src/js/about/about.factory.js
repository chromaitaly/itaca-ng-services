/**
 * Servizio per le info dell'applicazione
 */
(function() {
    'use strict';
    
    angular.module("itaca.services").factory('About', AboutFactory);
    
    /* @ngInject */
    function AboutFactory($resource, $q) {			
    	var $$service = {};
    	
    	$$service.url = "/api/rs/public/about";
    	
    	$$service.get = function() {
    		var deferred = $q.defer();
    		
    		$resource(this.url).get().$promise.then(function(response) {
    			deferred.resolve(response);
    		}, function(response) {
    			deferred.reject(response.data && response.data.message ? response.data.message : "Error getting application info");
    		});

    		return deferred.promise;
    	};
    	
    	return $$service;
    }
})();