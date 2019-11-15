(function() {
    'use strict';
    
    angular.module("itaca.services").provider('Locale', LocaleProvider);
	
	function LocaleProvider() {
		var $$cookieName = "X-ITACA-LOCALE", $$url = '/api/rs/public/lang/:lang';

		this.init = function(initObj) {
			if (initObj) {
				if (initObj.cookieName) {
					$cookieName = initObj.cookieName;
				}
				
				if (initObj.postUrl) {
					$$url = initObj.postUrl;
				}
			}
		};
		
		this.setCookieName = function(cookieName) {
			if(_.isString(cookieName)) {
				$$cookieName = cookieName;
			}
		};
		
		this.setUrl = function(url) {
			if(_.isString(url)) {
				$$url = url;
			}
		};

		this.$get = /* @ngInject */ function($cookies, $window, $translate, tmhDynamicLocale, amMoment, $q, $resource, AppOptions) {
			return new Locale($cookies, $window, $translate, tmhDynamicLocale, amMoment, $q, $resource, AppOptions, $$cookieName, $$url);
		};
	}
    
    function Locale($cookies, $window, $translate, tmhDynamicLocale, amMoment, $q, $resource, AppOptions, cookieName, url){
    	var $$service = this;
    	
    	this.$$cookieName = cookieName;
    	
    	this.API = $resource(url, {lang: "@lang"});
    	
    	this.supported = function() {
    		var supported = [];
    		
    		var it = {iso: "it-IT", label: $translate.instant('language.italian'), language: "it", flag: "it"};
    		var en = {iso: "en-GB", label: $translate.instant('language.english'), language: "en", flag: "gb"};
    		
    		supported = [it, en];
    		
    		return supported;
    	};
    	
    	this.load = function(){
    		var deferred = $q.defer();
    		
    		$$service.API.get().$promise.then(function(response) {
    			var locale = $$service.get(response.lang);
    			
    			if (_.isNil(locale)) {
        			// get default locale
        			locale = $$service.get(AppOptions.defaultLang);
        		}
    			
    			// set locale for all services
    			$$service.$save(locale);
    			
    			deferred.resolve(locale);
    			
    		}, function(response) {
    			deferred.reject("Error applying user locale: " + (response.data ? response.data.message : ""));
    		});
    		
    		return deferred.promise;
    	};
    	
    	this.current = function(){
    		var lang = $cookies.get($$service.$$cookieName);
    		
    		// if no cookie, get from browser
    		if (_.isNil(lang)) {
    			lang = $window.navigator.language || $window.navigator.userLanguage; 
    		}
    		
    		var locale = $$service.get(lang);
    		
    		if (_.isNil(locale)) {
    			// get default locale
    			locale = $$service.get(AppOptions.defaultLang);
    		}
    		
    		return locale;
    	};
    	
    	this.get = function(lang) {
    		if(_.isNil(lang)){
    			return null;
    		}
    		
    		var supportedLocales = $$service.supported();
    		
    		var locale = _.find(supportedLocales, ["iso", lang]);
    		
    		if (!locale) {
    			locale = _.find(supportedLocales, function(l) {
    				return lang.split("-")[0] == l.language;
    			});
    		}
    		
    		return locale;
    	};
    			
    	this.set = function(lang){	
    		var deferred = $q.defer();
    		
    		var data = {};
    		
    		if(!_.isNil(lang)) {
	    		var locale = $$service.get(lang);
	    		
	    		if (_.isNil(locale)) {
	    			deferred.reject("Language not supported: " + lang);
	    			return deferred.promise;
	    		}
	    		
	    		data = {lang: locale.iso};
    		}
    		
    		$$service.API.save(data).$promise.then(function(response) {
    			locale = $$service.get(response.lang);
    			
    			// set locale for all services
    			$$service.$save(locale);
    			
    			deferred.resolve(locale);
    			
    		}, function(response) {
    			deferred.reject("Error setting locale: " + (response.data ? response.data.message : ""));
    		});
    		
    		return deferred.promise;
    	};
    	
    	this.$save = function(locale) {
    		// set locale for all services
			$translate.use(locale.language);
			tmhDynamicLocale.set(locale.language);
			amMoment.changeLocale(locale.language);
			
			// Applico la lingua corrente a appOptions
			AppOptions.currentLang = locale.iso;
			
			// set cookie
			$cookies.put($$service.$$cookieName, locale.iso);
    	};
    	
    	this.list = function() {
    		var deferred = $q.defer();

    		$http.get("/resources/public/js/data/json/locales-list.json").then(function(response){
    			deferred.resolve(response.data);
    			$$service.localesList = response.data; // salvo la lista nel servizio
    			
    		}, function(response) {
    			deferred.reject("Error loading locales list");
    		});
    		
    		return deferred.promise;
    	};
    	
    	this.getLocale = function(iso2code){
    		var locale;
    		
    		if (!$$service.localesList){
    			$$service.list().then(function(data){
    				locale = _.find(data, function(o){
    					return o['1'] == iso2code;
    				});
    			});
    			
    		} else {
    			locale = _.find($$service.localesList, function(o){
    				return o['1'] == iso2code;
    			});
    		}
    		
    		return locale;
    	};
    }
})();