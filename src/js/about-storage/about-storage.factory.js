/**
 * Servizio per le info di storage
 */
(function() {
    'use strict';
    
    angular.module("itaca.services").factory('AboutStorage', AboutStorageFactory);
    
    /* @ngInject */
    function AboutStorageFactory($resource, $q) {			
    	var $$service = {};
    	
    	$$service.url = "/api/rs/public/storage";
    	
    	$$service.get = function() {
    		var deferred = $q.defer();
    		
    		$resource(this.url).get().$promise.then(function(response) {
    			deferred.resolve(response);
    		}, function(response) {
    			deferred.reject(response.data && response.data.message ? response.data.message :  "Error getting application storage info");
    		});

    		return deferred.promise;
    	};
    	
    	return $$service;
    }
})();
