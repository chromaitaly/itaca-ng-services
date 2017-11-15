/*******************************************************************************
********************************************************************************
********************************************************************************
***	   itaca-ng-services														 
***    Copyright (C) 2016   Chroma Italy Hotels srl	 
***                                                                          
***    This program is free software: you can redistribute it and/or modify  
***    it under the terms of the GNU General Public License as published by  
***    the Free Software Foundation, either version 3 of the License, or     
***    (at your option) any later version.                                   
***                                                                          
***    This program is distributed in the hope that it will be useful,       
***    but WITHOUT ANY WARRANTY; without even the implied warranty of        
***    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the         
***    GNU General Public License for more details.                          
***                                                                          
***    You should have received a copy of the GNU General Public License     
***    along with this program.  If not, see <http://www.gnu.org/licenses/>. 
********************************************************************************
********************************************************************************
*******************************************************************************/
(function() {
    "use strict";
    angular.module("itaca.services", [ "ngMaterial", "itaca.utils", "pascalprecht.translate", "tmh.dynamicLocale", "LocalStorageModule" ]);
})();

(function() {
    "use strict";
    CountryFactory.$inject = [ "$resource", "$q" ];
    angular.module("itaca.services").factory("Country", CountryFactory);
    function CountryFactory($resource, $q) {
        var $$service = {};
        $$service.url = "https://restcountries.eu/rest/v2";
        var request = function(data, headersGetter) {
            var headers = headersGetter();
            delete headers["X-Requested-With"];
            delete headers["x-requested-with"];
            return data;
        };
        $$service.methods = {
            all: {
                method: "GET",
                url: service.url + "/all",
                isArray: true,
                transformRequest: request
            },
            getByName: {
                method: "GET",
                url: service.url + "/name/:name",
                isArray: true,
                transformRequest: request
            },
            getByIso: {
                method: "GET",
                url: service.url + "/alpha/:iso",
                transformRequest: request
            }
        };
        $$service.API = $resource($$service.url + "/all", {}, methods);
        service.all = function() {
            var deferred = $q.defer();
            $$service.API.all().$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting countries");
            });
            return deferred.promise;
        };
        service.getByName = function(name) {
            var deferred = $q.defer();
            if (!name) {
                deferred.reject("Name not defined");
                return deferred.promise;
            }
            $$service.API.getByName({
                name: name
            }).$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting country");
            });
            return deferred.promise;
        };
        service.getByIso = function(iso) {
            var deferred = $q.defer();
            if (!iso) {
                deferred.reject("ISO code not defined");
                return deferred.promise;
            }
            $$service.API.getByIso({
                iso: iso
            }).$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting country");
            });
            return deferred.promise;
        };
        $$service.all = function() {
            var deferred = $q.defer();
            $$service.API.query().$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject("Error getting countries: " + response && response.message ? response.message : "");
            });
            return deferred.promise;
        };
        return $$service;
    }
})();

(function() {
    "use strict";
    angular.module("itaca.services").provider("Currency", CurrencyProvider);
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
            if (_.isString(cookieName)) {
                $$cookieName = cookieName;
            }
        };
        this.setRatesCookieName = function(ratesCookieName) {
            if (_.isString(ratesCookieName)) {
                $$ratesCookieName = ratesCookieName;
            }
        };
        this.$get = [ "$log", "$cookies", "$q", "$resource", "localStorageService", "iso4217", "AppOptions", function($log, $cookies, $q, $resource, localStorageService, iso4217, AppOptions) {
            return new Currency($log, $cookies, $q, $resource, localStorageService, iso4217, AppOptions, $$cookieName, $$ratesCookieName);
        } ];
    }
    function Currency($log, $cookies, $q, $resource, localStorageService, iso4217, AppOptions, cookieName, ratesCookieName) {
        var $$service = this;
        this.$$cookieName = $$cookieName;
        this.$$ratesCookieName = $$ratesCookieName;
        this.API = $resource("https://api.fixer.io/latest");
        this.current = {
            iso: "EUR",
            symbol: "€",
            rate: 1
        };
        this.$init = function() {
            $$service.set();
        };
        this.all = function() {
            var deferred = $q.defer();
            var currencyList = {
                importants: {},
                others: {}
            };
            if ($$service.supported) {
                var curList = _.pickBy(iso4217.getCurrencies(), function(value, key) {
                    return !_.isNil($$service.supported[key]) || key == $$service.current.iso;
                });
                _.forEach(curList, function(v, k) {
                    if (k == $$service.current.iso) {
                        currencyList.current = curList[k];
                        currencyList.current.key = k;
                    } else if (k == "EUR" || k == "USD" || k == "AUD" || k == "CAD" || k == "GBP" || k == "CNY" || k == "JPY") {
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
            if (_.isNil(currency)) {
                return null;
            }
            var avCurrency = iso4217.getCurrencyByCode(currency);
            if (!_.isNil(avCurrency)) {
                return avCurrency;
            }
            return null;
        };
        this.set = function(currencyISO) {
            if (_.isNil(currencyISO)) {
                currencyISO = $cookies.get($$service.$$cookieName);
                if (_.isNil(currencyISO)) {
                    currencyISO = "EUR";
                }
            }
            var deferred = $q.defer();
            var currency = $$service.get(currencyISO);
            if (_.isNil(currency)) {
                deferred.reject("Currency not supported: " + currencyISO);
                return deferred.promise;
            }
            $$service.getExchangeForCurrency(currencyISO).then(function(exchange) {
                $$service.supported = exchange.rates;
                $cookies.put($$service.$$cookieName, currencyISO);
                AppOptions.currentCurrency = currencyISO;
                _.assign($$service.current, {
                    iso: currencyISO,
                    symbol: currency.symbol,
                    rate: $$service.supported && $$service.supported[currencyISO] ? $$service.supported[currencyISO] : 1
                });
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
                $$service.API.get({
                    base: baseCurrencyIso
                }).then(function(response) {
                    exchange = response.data;
                    exchange.base = {
                        iso: response.data.base,
                        symbol: currency.symbol
                    };
                    exchange.date = new Date();
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
        this.init();
    }
})();

(function() {
    "use strict";
    GoogleFactory.$inject = [ "$http", "$resource", "$q", "$log" ];
    angular.module("itaca.services").factory("GoogleAPI", GoogleFactory);
    function GoogleFactory($http, $resource, $q, $log) {
        var $$service = {};
        $$service.autocompleteSvc = new google.maps.places.AutocompleteService();
        $$service.placesSvc = new google.maps.places.PlacesService(document.createElement("div"));
        $$service.geocoderSvc = new google.maps.Geocoder();
        $$service.cities = function(filter, nationalityAlpha2Code) {
            var deferred = $q.defer();
            $$service.autocompleteSvc.getPlacePredictions({
                input: filter,
                types: [ "(cities)" ],
                componentRestrictions: {
                    country: nationalityAlpha2Code
                }
            }, function(predictions, status) {
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
            this.autocompleteSvc.getPlacePredictions({
                input: filter,
                types: [ "address" ],
                componentRestrictions: {
                    country: nationalityAlpha2Code
                }
            }, function(predictions, status) {
                if (status != google.maps.places.PlacesServiceStatus.OK) {
                    deferred.reject("Error getting addresses: " + status);
                } else {
                    deferred.resolve(predictions);
                }
            });
            return deferred.promise;
        };
        $$service.zipCodes = function(filter, nationalityAlpha2Code) {
            var deferred = $q.defer();
            $$service.geocoderSvc.geocode({
                componentRestrictions: {
                    country: nationalityAlpha2Code,
                    postalCode: filter
                }
            }).$promise.then(function(response) {
                deferred.resolve(response.results);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting zip codes");
            });
            return deferred.promise;
        };
        $$service.latLong = function(address) {
            var deferred = $q.defer();
            $$service.geocoderSvc.geocode({
                address: address
            }, function(results, status) {
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

(function() {
    "use strict";
    LoadingProgressFactory.$inject = [ "$timeout", "HtmlUtils" ];
    angular.module("itaca.services").factory("LoadingProgress", LoadingProgressFactory);
    function LoadingProgressFactory($timeout, HtmlUtils) {
        var $$service = {};
        $$service.start = function(opts) {
            if (!$$service.$$loadingEl) {
                var scope = {
                    data: opts,
                    active: true
                };
                var el = '<ch-loading-progress ng-if="data.active" message="data.message" message-key="data.messageKey" ' + "error-message=\"data.error ? data.errorMessage : ''\" error-message-key=\"data.error ? data.errorMessageKey : ''\" " + 'hide-siblings="data.active"></ch-loading-progress>';
                $$service.$$loadingEl = HtmlUtils.addElement(el, scope, null, true);
            } else {
                $$service.updateOpts({
                    data: opts
                });
            }
        };
        $$service.stop = function(error, delay) {
            $$service.updateOpts({
                error: _.isBoolean(error) ? error : !_.isNil(error)
            });
            $timeout(function() {
                $$service.updateOpts({
                    active: false
                });
            }, delay || 0);
        };
        $$service.updateOpts = function(opts) {
            if (!_.isPlainObject(opts)) {
                return;
            }
            if ($$service.$$loadingEl) {
                _.assign($$service.$$loadingEl.scope(), opts);
            }
        };
        return $$service;
    }
})();

(function() {
    "use strict";
    LoadingFactory.$inject = [ "$rootScope", "$timeout", "HtmlUtils" ];
    angular.module("itaca.services").factory("Loading", LoadingFactory);
    function LoadingFactory($rootScope, $timeout, HtmlUtils) {
        var $$service = {};
        $$service.start = function(opts) {
            if (!$$service.$$loadingEl) {
                var scope = {
                    data: opts,
                    active: true
                };
                var el = '<ch-loading-progress ng-if="data.active" message="data.message" message-key="data.messageKey"></ch-loading-progress>';
                $$service.$$loadingEl = HtmlUtils.addElement(el, scope, null, true);
            } else {
                $$service.updateOpts({
                    data: opts
                });
            }
        };
        $$service.stop = function(error, delay) {
            $timeout(function() {
                $$service.updateOpts({
                    active: false
                });
            }, delay || 0);
        };
        $$service.updateOpts = function(opts) {
            if (!_.isPlainObject(opts)) {
                return;
            }
            if ($$service.$$loadingEl) {
                _.assign($$service.$$loadingEl.scope(), opts);
            }
        };
        return $$service;
    }
})();

(function() {
    "use strict";
    angular.module("itaca.services").provider("Locale", LocaleProvider);
    function LocaleProvider() {
        var $$cookieName = "X-ITACA-LOCALE", $$url = "/api/rs/public/lang/:lang";
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
            if (_.isString(cookieName)) {
                $$cookieName = cookieName;
            }
        };
        this.setUrl = function(url) {
            if (_.isString(url)) {
                $$url = url;
            }
        };
        this.$get = [ "$cookies", "$window", "$translate", "tmhDynamicLocale", "amMoment", "$q", "$resource", "AppOptions", function($cookies, $window, $translate, tmhDynamicLocale, amMoment, $q, $resource, AppOptions) {
            return new Locale($cookies, $window, $translate, tmhDynamicLocale, amMoment, $q, $resource, AppOptions, $$cookieName, $$url);
        } ];
    }
    function Locale($cookies, $window, $translate, tmhDynamicLocale, amMoment, $q, $resource, AppOptions, cookieName, url) {
        var $$service = this;
        this.$$cookieName = cookieName;
        this.API = $resource(url);
        this.supported = function() {
            var supported = [];
            var it = {
                iso: "it",
                label: $translate.instant("language.italian"),
                flag: "it"
            };
            var en = {
                iso: "en",
                label: $translate.instant("language.english"),
                flag: "gb"
            };
            supported = [ it, en ];
            return supported;
        };
        this.current = function() {
            var lang = $cookies.get($$service.$$cookieName);
            if (_.isNil(lang)) {
                lang = $window.navigator.language || $window.navigator.userLanguage;
            }
            lang = lang.split("-")[0];
            var locale = $$service.get(lang);
            if (_.isNil(locale)) {
                locale = $$service.get(AppOptions.defaultLang);
            }
            return locale;
        };
        this.get = function(lang) {
            if (_.isNil(lang)) {
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
        this.set = function(lang) {
            if (_.isNil(lang)) {
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
            $$service.API.save({
                lang: lang
            }).$promise.then(function(response) {
                $translate.use(lang);
                tmhDynamicLocale.set(lang);
                amMoment.changeLocale(lang);
                $cookies.put($$service.$$cookieName, locale.iso);
                deferred.resolve($$service.current());
            }, function(response) {
                deferred.reject("Error setting locale: " + (response.data ? response.data.message : ""));
            });
            return deferred.promise;
        };
    }
})();

(function() {
    "use strict";
    NavigationFactory.$inject = [ "$http", "$window", "$document", "$log", "$location", "$timeout", "$anchorScroll", "$mdSidenav", "$state", "$rootScope" ];
    angular.module("itaca.services").factory("Navigation", NavigationFactory);
    function NavigationFactory($http, $window, $document, $log, $location, $timeout, $anchorScroll, $mdSidenav, $state, $rootScope) {
        var $$service = {};
        $$service.logout = function() {
            $log.info("Logging out...");
            $http.post("logout", {}).then(function() {
                $log.info("Logout success. Going back to home...");
            }, function(error) {
                $log.error("Logout failed!");
            }).finally($$service.home);
        };
        $$service.login = function() {
            location.assign("/login");
        };
        $$service.home = function() {
            location.assign("/");
        };
        $$service.go = function(url, reload, newPage) {
            reload ? location.assign(url) : newPage ? $window.open(url) : $location.url(url);
        };
        $$service.goToState = function(stateName, params, options) {
            $state.go(stateName, params, options);
        };
        $$service.reload = function() {
            $window.location.reload();
        };
        $$service.reloadState = function(url, params) {
            if (!url) {
                $state.reload();
            } else {
                $state.transitionTo(url, params, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            }
        };
        $$service.redirect = function(page) {
            $timeout(function() {
                $location.url("/" + page);
            }, 5e3);
        };
        $$service.goToAnchor = function(anchor) {
            if (anchor) {
                anchor = anchor.startsWith("#") ? anchor.substring(1) : anchor;
                var id = document.getElementById(anchor);
                if (id != null) {
                    $document.scrollToElementAnimated(angular.element(id));
                }
            }
        };
        service.scrollToAnchor = function(anchor) {
            if (anchor) {
                anchor = anchor.startsWith("#") ? anchor.substring(1) : anchor;
                $anchorScroll(anchor);
            }
        };
        $$service.top = function(setOnload) {
            $document.scrollTopAnimated(0);
            if (setOnload) {
                window.onload = function() {
                    $document.scrollTopAnimated(0);
                };
            }
        };
        $$service.toggleLeftMenu = function() {
            $mdSidenav("leftMenu").toggle();
            AppOptions.hideLeftMenu = !AppOptions.hideLeftMenu;
        };
        $$service.closeLeftMenu = function(keepClosed) {
            $mdSidenav("leftMenu").close();
            AppOptions.hideLeftMenu = keepClosed;
        };
        $$service.isLeftMenuOpen = function() {
            return $mdSidenav("leftMenu").isOpen();
        };
        $$service.top = function() {
            $document.scrollTopAnimated(0);
        };
        $$service.historyBack = function() {
            $window.history.back();
        };
        $$service.back = function() {
            $rootScope.$broadcast("back");
        };
        $$service.next = function(args) {
            $rootScope.$broadcast("next", args);
        };
        return $$service;
    }
})();

(function() {
    "use strict";
    NotificationFactory.$inject = [ "$mdToast", "$mdMedia" ];
    angular.module("itaca.services").factory("Notification", NotificationFactory);
    function NotificationFactory($mdToast, $mdMedia) {
        var $$service = {};
        $$service.message = function(message, onHideFunc, btnText) {
            var position = $mdMedia("gt-sm") ? "top right" : "top";
            $$service.showSimple(message, onHideFunc, btnText, position, true);
        };
        $$service.error = function(message, onHideFunc) {
            var position = $mdMedia("gt-sm") ? "top right" : "top";
            $$service.showSimple(message, onHideFunc, null, position, false);
        };
        $$service.showSimple = function(message, onHideFunc, btnText, position, capsule) {
            var toast = $mdToast.simple().textContent(message).position(position).capsule(capsule);
            if (angular.isDefined(btnText)) {
                toast.action(btnText);
            }
            $mdToast.show(toast).then(function(response) {
                if (angular.isDefined(onHideFunc)) {
                    onHideFunc(response);
                }
            });
        };
        return $$service;
    }
})();