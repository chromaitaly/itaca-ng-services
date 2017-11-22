(function() {
    'use strict';
    
    angular.module("itaca.services").provider('Currency', CurrencyProvider);
	
	function CurrencyProvider() {
		var $$cookieName = "X-ITACA-CURRENCY", $$ratesCookieName = "X-ITACA-CURRENCY-RATES";

		this.init = function(initObj) {
			if (initObj) {
				if (initObj.cookieName) {
					$cookieName = initObj.cookieName;
				}
				
				if (initObj.postUrl) {
					$$ratesCookieName = initObj.ratesCookieName;
				}
			}
		};
		
		this.setCookieName = function(cookieName) {
			if(_.isString(cookieName)) {
				$$cookieName = cookieName;
			}
		};
		
		this.setRatesCookieName = function(ratesCookieName) {
			if(_.isString(ratesCookieName)) {
				$$ratesCookieName = ratesCookieName;
			}
		};

		this.$get = /* @ngInject */ function($log, $cookies, $q, $resource, localStorageService, iso4217, AppOptions) {
			return new Currency($log, $cookies, $q, $resource, localStorageService, iso4217, AppOptions, $$cookieName, $$ratesCookieName);
		};
	}
    
    function Currency($log, $cookies, $q, $resource, localStorageService, iso4217, AppOptions, cookieName, ratesCookieName){
	 	var $$service = this;
	 	
	 	this.$$cookieName = $$cookieName;
	 	this.$$ratesCookieName = $$ratesCookieName;
	 	
    	this.API = $resource("https://api.fixer.io/latest");
	 	
	 	this.current = {iso : 'EUR', symbol: "€", rate : 1};
	 	
	 	this.$init = function() {
	 		$$service.set();
	 	};	 	
	 	
	 	this.all = function() {
	 		var deferred = $q.defer();
	 		
	 		var currencyList = {importants: {}, others : {}};
	 		
	 		if($$service.supported){			
	 			var curList =_.pickBy(iso4217.getCurrencies(), function(value, key) {
	 				return !_.isNil($$service.supported[key]) || key == $$service.current.iso;
	 			});
	 			
	 			//prendo solo le valute piu importanti
	 			_.forEach(curList, function(v, k){
	 				if (k == $$service.current.iso) {
	 					currencyList.current = curList[k];
	 					currencyList.current.key = k;
	 					
	 				} else if(k == 'EUR' || k == 'USD' || k == 'AUD' || k == 'CAD' || k == 'GBP' || k == 'CNY' || k == 'JPY'){
	 					currencyList.importants[k] = curList[k];
	 					
	 				} else {
	 					currencyList.others[k] = curList[k];
	 				}
	 			});
	 			
	 			deferred.resolve(currencyList);
	 			
	 		} else {
	 			$$service.set().then(function() {
	 				$$service.all().then(function(data) {
	 					deferred.resolve(data);	
	 				});				
	 			});
	 		}
	 		
	 		return deferred.promise;
	 	};
	
	 	this.get = function(currency) {
	 		if(_.isNil(currency)){
	 			return null;
	 		}
	
	 		var avCurrency = iso4217.getCurrencyByCode(currency);
	 		
	 		if (!_.isNil(avCurrency)) {
	 			return avCurrency;
	 		}			
	 		
	 		return null;
	 	};
	 			
	 	this.set = function(currencyISO){	
	 		if(_.isNil(currencyISO)){
	 			currencyISO = $cookies.get($$service.$$cookieName);
	 			
	 			if (_.isNil(currencyISO)) {
	 				currencyISO = 'EUR'; 
	 			}
	 		}
	 				
	 		var deferred = $q.defer();
	 		
	 		var currency = $$service.get(currencyISO);
	 		
	 		if (_.isNil(currency)) {
	 			deferred.reject("Currency not supported: " + currencyISO);
	 			return deferred.promise;
	 		} 
	 				
	 		// recupero il cambio attuale rispetto alla valuta corrente
	 	    $$service.getExchangeForCurrency(currencyISO).then(function(exchange){
	 	    	
	 	    	$$service.supported = exchange.rates;
	 			
	 			// set cookie
	 			$cookies.put($$service.$$cookieName, currencyISO);
	 			
	 			// lo inserisco dentro appOption per poterlo riutilizzare in tutte le circostanze
	 			AppOptions.currentCurrency = currencyISO;
	 			
	 			// store current currency
	 			_.assign($$service.current, {
	 				iso: currencyISO,
	 				symbol: currency.symbol,
	 				rate: ($$service.supported && $$service.supported[currencyISO]) ? $$service.supported[currencyISO] : 1
	 			});
	 			
	 			// return currency
	 			deferred.resolve($$service.current);
	 	    
	 	    }, function(response) {
	 	    	deferred.reject(response);
	 	    });
	 			
	 		return deferred.promise;
	 	};
	 	
	 	this.getExchangeForCurrency = function(baseCurrencyIso, reload) {
	 		var deferred = $q.defer();
	 		
	 		var currency = $$service.get(baseCurrencyIso);
	 		
	 		if (_.isNil(currency)) {
	 			deferred.reject("Currency not supported: " + baseCurrencyIso);
	 			return deferred.promise;
	 		} 
	 		
	 		var currencyRateList = localStorageService.get($$service.$$ratesCookieName);
	 		
	 		if (!_.isArray(currencyRateList)) {
	 			currencyRateList = [];
	 			localStorageService.remove($$service.$$ratesCookieName);
	 		
	 		} else {
	 			var expired = _.some(currencyRateList, function(value) {
	 				if (_.isNil(value.date)) {
	 					return true;
	 				}				
	 				var m = moment.isDate(value.date) ? moment(value.date) : moment(value.date, "YYYY-MM-DD");  
	 				return m.isBefore(moment(), "days");
	 			});
	 			
	 			if (expired) {
	 				currencyRateList = [];
	 				localStorageService.remove($$service.$$ratesCookieName);
	 			}
	 		}
	 		
	 		var exchange = _.find(currencyRateList, function(value) {
	 			return value.base.iso == baseCurrencyIso && !_.isEmpty(value.rates);
	 		});
	 		
	 		if (exchange && !reload) {
	 			deferred.resolve(exchange);
	 			
	 		} else {		
	 			// recupero il cambio attuale rispetto alla valuta passata
	 		    $$service.API.get({base: baseCurrencyIso}).then(function(response){
	 		    	exchange = response.data;
	 		    	exchange.base = {iso: response.data.base, symbol: currency.symbol};
	 		    	exchange.date = new Date();
	 		    	
	 		    	// salvo/aggiorno il cambio attuale fino alla mezzanotte di oggi (per limitare future richieste)
	 		    	currencyRateList = currencyRateList || [];
	 		    	
	 		    	var currentIdx = _.findIndex(currencyRateList, function(value) {
	 					return value.base.iso == baseCurrencyIso && !_.isEmpty(value.rates);
	 				});
	 		    	
	 		    	if (currentIdx >= 0) {	
	 		    		currencyRateList[currentIdx] = exchange;
	 		    		
	 		    	} else {
	 		    		currencyRateList.push(exchange);
	 		    	}
	 		    	
	 		    	localStorageService.set($$service.$$ratesCookieName, currencyRateList);
	 		    	
	 		    	deferred.resolve(exchange);
	 		    	
	 		    }, function(response) {
	 		    	deferred.reject(response);
	 		    });
	 		}
	 		
	 		return deferred.promise;
	 	};
	 	
	 	this.getExchangeForCurrencyCached = function(baseCurrencyIso) {
	 		var currency = $$service.get(baseCurrencyIso);
	 		
	 		if (_.isNil(currency)) {
	 			$log.warn("Currency not supported: " + baseCurrencyIso);
	 			return null;
	 		} 
	 		
	 		var currencyRateList = localStorageService.get($$service.$$ratesCookieName);
	 		
	 		if (!_.isArray(currencyRateList)) {
	 			currencyRateList = [];
	 			localStorageService.remove($$service.$$ratesCookieName);
	 		
	 		} else {
	 			var expired = _.some(currencyRateList, function(value) {
	 				if (_.isNil(value.date)) {
	 					return true;
	 				}				
	 				var m = moment.isDate(value.date) ? moment(value.date) : moment(value.date, "YYYY-MM-DD");  
	 				return m.isBefore(moment(), "days");
	 			});
	 			
	 			if (expired) {
	 				currencyRateList = [];
	 				localStorageService.remove($$service.$$ratesCookieName);
	 			}
	 		}
	 		
	 		var exchange = _.find(currencyRateList, function(value) {
	 			return value.base.iso == baseCurrencyIso && !_.isEmpty(value.rates);
	 		});
	 		
	 		return exchange;
	 	};
	 	
	 	// init
	 	this.init();
	 }
})();