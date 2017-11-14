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
    	
    	this.API = $resource(url);
    	
    	this.supported = function() {
    		var supported = [];
    		
    		var it = {iso: "it", label: $translate.instant('language.italian'), flag: "it"};
    		var en = {iso: "en", label: $translate.instant('language.english'), flag: "gb"};
    		
    		supported = [it, en];
    		
    		return supported;
    	};
    	
    	this.current = function(){
    		var lang = $cookies.get($$service.$$cookieName);
    		
    		// if no cookie, get from browser
    		if (_.isNil(lang)) {
    			lang = $window.navigator.language || $window.navigator.userLanguage; 
    		}
    		
    		lang = lang.split("-")[0];

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
    		
    		lang = lang.split("-")[0];
    		
    		var supportedLocales = $$service.supported();
    		
    		var idx;
    		
    		for (idx in supportedLocales) {
    			var locale = supportedLocales[idx];
    			if (_.isEqual(locale.iso, lang)) {
    				return locale;
    			}			
    		}
    		
    		return null;
    	};
    			
    	this.set = function(lang){	
    		if(_.isNil(lang)){
    			lang = $cookies.get($$service.$$cookieName);
    			
    			if (_.isNil(lang)) {
    				lang = $window.navigator.language || $window.navigator.userLanguage; 
    			}
    		}
    		
    		lang = lang.split("-")[0];
    		
    		var deferred = $q.defer();
    		
    		var locale = $$service.get(lang);
    		
    		if (_.isNil(locale)) {
    			deferred.reject("Language not supported: " + lang);
    			return deferred.promise;
    		} 
    		
    		$$service.API.save({lang: lang}).$promise.then(function(response) {
    			// set locale for all modules
    			$translate.use(lang);
    			tmhDynamicLocale.set(lang);
    			amMoment.changeLocale(lang);
    			
    			// set cookie
    			$cookies.put($$service.$$cookieName, locale.iso);
    			
    			deferred.resolve($$service.current());
    			
    		}, function(response) {
    			deferred.reject("Error setting locale: " + (response.data ? response.data.message : ""));
    		});
    		
    		return deferred.promise;
    	};
    }
})();