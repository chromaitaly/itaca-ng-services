/**
 * Servizio per le info dell'applicazione
 */
(function() {
    'use strict';
    
    angular.module("itaca.factory").factory('Template', TemplateFactory);
    
    /* @ngInject */
    function TemplateFactory($resource, $q) {			
    	var $$service = {};
    	
    	$$service.url = "/api/rs/public/template";
    	
    	var methods = {
    			managersTerms: {method: "GET", url: $$service.url + "/terms/manager"},
    			guestsTerms: {method: "GET", url: $$service.url + "/terms/guest"},
    			privacy: {method: "GET", url: $$service.url + "/privacy/guest"},
    			aboutUs: {method: "GET", url: $$service.url + "/aboutUs"},
    			faq: {method: "GET", url: $$service.url + "/faq"},
    			security: {method: "GET", url: $$service.url + "/security"},
    			contacts: {method: "GET", url: $$service.url + "/contacts"},
    			reviewsGuidelines: {method: "GET", url: $$service.url + "/reviews/guidelines/guest"},
    			reviewsInfo: {method: "GET", url: $$service.url + "/reviews/info"},
    			reviewsAppInfo: {method: "GET", url: $$service.url + "/reviews/appinfo"},
    		};
    	
    	$$service.REQUEST = $resource($$service.url, {}, methods);
    	
    	
    	$$service.managersTerms = function() {
    		var deferred = $q.defer();
    		
    		this.REQUEST.managersTerms().$promise.then(function(response) {
    			deferred.resolve(response);
    		}, function(response) {
    			deferred.reject(response.data && response.data.message ? response.data.message :  "Error getting terms and conditions");
    		});

    		return deferred.promise;
    		
    	};
    	
		$$service.guestsTerms = function() {
			var deferred = $q.defer();
			
			this.REQUEST.guestsTerms().$promise.then(function(response) {
				deferred.resolve(response);
			}, function(response) {
				deferred.reject(response.data && response.data.message ? response.data.message :  "Error getting terms and conditions");
			});
	
			return deferred.promise;
			
		};
		
		$$service.privacy = function() {
			var deferred = $q.defer();
			
			this.REQUEST.privacy().$promise.then(function(response) {
				deferred.resolve(response);
			}, function(response) {
				deferred.reject(response.data && response.data.message ? response.data.message :  "Error getting privacy");
			});
	
			return deferred.promise;
		};
		
		$$service.aboutUs = function() {
			var deferred = $q.defer();
			
			this.REQUEST.aboutUs().$promise.then(function(response) {
				deferred.resolve(response);
			}, function(response) {
				deferred.reject(response.data && response.data.message ? response.data.message :  "Error getting about us");
			});
	
			return deferred.promise;
		};
		
		$$service.faq = function() {
			var deferred = $q.defer();
			
			this.REQUEST.faq().$promise.then(function(response) {
				deferred.resolve(response);
			}, function(response) {
				deferred.reject(response.data && response.data.message ? response.data.message :  "Error getting faq");
			});
	
			return deferred.promise;
		};
		
		$$service.security = function() {
			var deferred = $q.defer();
			
			this.REQUEST.security().$promise.then(function(response) {
				deferred.resolve(response);
			}, function(response) {
				deferred.reject(response.data && response.data.message ? response.data.message :  "Error getting security");
			});
	
			return deferred.promise;
		};
		
		$$service.contacts = function() {
			var deferred = $q.defer();
			
			this.REQUEST.contacts().$promise.then(function(response) {
				deferred.resolve(response);
			}, function(response) {
				deferred.reject(response.data && response.data.message ? response.data.message :  "Error getting contacts");
			});
	
			return deferred.promise;
		};
		
		$$service.reviewsGuidelines = function() {
			var deferred = $q.defer();
			
			this.REQUEST.reviewsGuidelines().$promise.then(function(response) {
				deferred.resolve(response);
			}, function(response) {
				deferred.reject(response.data && response.data.message ? response.data.message :  "Error getting reviews guidelines");
			});
	
			return deferred.promise;
		};
		
		$$service.reviewsInfo = function() {
			var deferred = $q.defer();
			
			this.REQUEST.reviewsInfo().$promise.then(function(response) {
				deferred.resolve(response);
			}, function(response) {
				deferred.reject(response.data && response.data.message ? response.data.message :  "Error getting reviews info");
			});

			return deferred.promise;
		};
		
		$$service.reviewsAppInfo = function() {
			var deferred = $q.defer();
			
			this.REQUEST.reviewsAppInfo().$promise.then(function(response) {
				deferred.resolve(response);
			}, function(response) {
				deferred.reject(response.data && response.data.message ? response.data.message :  "Error getting reviews app info");
			});
	
			return deferred.promise;
		};
	
	
	
    	return $$service;
    }
})();