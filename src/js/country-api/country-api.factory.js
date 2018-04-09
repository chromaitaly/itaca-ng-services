(function() {
	'use strict';
	
	angular.module("itaca.services").factory('CountryAPI', CountryApi); 
    
    /* @ngInject */
    function CountryApi($resource, $q) {	
		
    	var $$service = {};
	
		// API url delle country
		$$service.url = "https://restcountries.eu/rest/v2"; // versione 2
		
		var request = function(data, headersGetter) {
	        var headers = headersGetter();
	        delete headers['X-Requested-With'];
	        delete headers['x-requested-with'];
	        return data;	        
	    };
		
		var methods = {
			all: {method:'GET', url: $$service.url+"/all", isArray: true, transformRequest: request},
			getByName: {method: "GET", url: $$service.url + "/name/:name", isArray: true, transformRequest: request},
			getByIso: {method: "GET", url: $$service.url + "/alpha/:iso", transformRequest: request},
		};
		
		$$service.REQUEST = $resource(this.url, null, methods);
		
		$$service.all = function() {
			var deferred = $q.defer();
	
			this.REQUEST.all().$promise.then(function(response) {
				deferred.resolve(response);
			}, function(response) {
				deferred.reject(response.data && response.data.message ? response.data.message :  "Error getting countries");
			});		
	
			return deferred.promise;
		};
		
		$$service.getByName = function(name) {
			var deferred = $q.defer();
			
			if (!name) {
				deferred.reject("Name not defined");
				return deferred.promise;
			}
	
			this.REQUEST.getByName({name: name}).$promise.then(function(response) {
				deferred.resolve(response);
			}, function(response) {
				deferred.reject(response.data && response.data.message ? response.data.message :  "Error getting country");
			});		
	
			return deferred.promise;
		};
		
		$$service.getByIso = function(iso) {
			var deferred = $q.defer();
			
			if (!iso) {
				deferred.reject("ISO code not defined");
				return deferred.promise;
			}
	
			this.REQUEST.getByIso({iso: iso}).$promise.then(function(response) {
				deferred.resolve(response);
			}, function(response) {
				deferred.reject(response.data && response.data.message ? response.data.message :  "Error getting country");
			});		
	
			return deferred.promise;
		};
		
		return $$service;
    }
})();