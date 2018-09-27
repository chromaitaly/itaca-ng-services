/*******************************************************************************
********************************************************************************
********************************************************************************
***	   itaca-ng-services														 
***    Copyright (C) 2016-2018   Chroma Italy Hotels srl	 
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
    AboutStorageFactory.$inject = [ "$resource", "$q" ];
    angular.module("itaca.services").factory("AboutStorage", AboutStorageFactory);
    function AboutStorageFactory($resource, $q) {
        var $$service = {};
        $$service.url = "/api/rs/public/storage";
        $$service.get = function() {
            var deferred = $q.defer();
            $resource(this.url).get().$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting application storage info");
            });
            return deferred.promise;
        };
        return $$service;
    }
})();

(function() {
    "use strict";
    AboutFactory.$inject = [ "$resource", "$q" ];
    angular.module("itaca.services").factory("About", AboutFactory);
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

(function() {
    "use strict";
    ConfigFactory.$inject = [ "$resource", "$q" ];
    angular.module("itaca.services").factory("Config", ConfigFactory);
    function ConfigFactory($resource, $q) {
        var $$service = {};
        $$service.url = "/api/rs/secure/config";
        var methods = {
            amazon: {
                method: "GET",
                url: $$service.url + "/amz"
            },
            creditCard: {
                method: "GET",
                url: $$service.url + "/cc"
            }
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

(function() {
    "use strict";
    CountryApi.$inject = [ "$resource", "$q" ];
    angular.module("itaca.services").factory("CountryAPI", CountryApi);
    function CountryApi($resource, $q) {
        var $$service = {};
        $$service.url = "https://restcountries.eu/rest/v2";
        var request = function(data, headersGetter) {
            var headers = headersGetter();
            delete headers["X-Requested-With"];
            delete headers["x-requested-with"];
            return data;
        };
        var methods = {
            all: {
                method: "GET",
                url: $$service.url + "/all",
                isArray: true,
                transformRequest: request
            },
            getByName: {
                method: "GET",
                url: $$service.url + "/name/:name",
                isArray: true,
                transformRequest: request
            },
            getByIso: {
                method: "GET",
                url: $$service.url + "/alpha/:iso",
                transformRequest: request
            }
        };
        $$service.REQUEST = $resource(this.url, null, methods);
        $$service.all = function() {
            var deferred = $q.defer();
            this.REQUEST.all().$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting countries");
            });
            return deferred.promise;
        };
        $$service.getByName = function(name) {
            var deferred = $q.defer();
            if (!name) {
                deferred.reject("Name not defined");
                return deferred.promise;
            }
            this.REQUEST.getByName({
                name: name
            }).$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting country");
            });
            return deferred.promise;
        };
        $$service.getByIso = function(iso) {
            var deferred = $q.defer();
            if (!iso) {
                deferred.reject("ISO code not defined");
                return deferred.promise;
            }
            this.REQUEST.getByIso({
                iso: iso
            }).$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting country");
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
        var $$cookieName = "X-ITACA-CURRENCY", $$ratesCookieName = "X-ITACA-CURRENCY-RATES", $$accessKey = "de5e4f93006ee81e904bf3e0c95f7e28";
        this.init = function(initObj) {
            if (initObj) {
                if (initObj.cookieName) {
                    $$cookieName = initObj.cookieName;
                }
                if (initObj.postUrl) {
                    $$ratesCookieName = initObj.ratesCookieName;
                }
                if (initObj.accessKey) {
                    $$accessKey = initObj.accessKey;
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
        this.setAccessKey = function(accessKey) {
            if (_.isString(accessKey)) {
                $$accessKey = accessKey;
            }
        };
        this.$get = [ "$log", "$cookies", "$q", "$resource", "localStorageService", "iso4217", "AppOptions", function($log, $cookies, $q, $resource, localStorageService, iso4217, AppOptions) {
            return new Currency($log, $cookies, $q, $resource, localStorageService, iso4217, AppOptions, $$cookieName, $$ratesCookieName, $$accessKey);
        } ];
    }
    function Currency($log, $cookies, $q, $resource, localStorageService, iso4217, AppOptions, cookieName, ratesCookieName, accessKey) {
        var $$service = this;
        this.$$cookieName = cookieName;
        this.$$ratesCookieName = ratesCookieName;
        this.$$accessKey = accessKey;
        this.API = $resource("http://data.fixer.io/api/latest", {
            access_key: $$service.$$accessKey
        });
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
            }, function(error) {
                deferred.reject(error);
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
                }).$promise.then(function(response) {
                    if (!response.success) {
                        deferred.reject(response.error && response.error.info ? response.error.info : "Error getting currencies");
                        return;
                    }
                    exchange = {
                        base: {
                            iso: response.base,
                            symbol: currency.symbol
                        },
                        date: response.date || new Date(),
                        rates: response.rates
                    };
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
                    deferred.reject(response.error && response.error.info ? response.error.info : "Error getting currencies");
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
        this.$init();
    }
})();

(function() {
    "use strict";
    GoogleApi.$inject = [ "$http", "$resource", "$q", "$log" ];
    angular.module("itaca.services").factory("GoogleAPI", GoogleApi);
    function GoogleApi($http, $resource, $q, $log) {
        var $$service = {};
        $$service.autocompleteSvc = new google.maps.places.AutocompleteService();
        $$service.placesSvc = new google.maps.places.PlacesService(document.createElement("div"));
        $$service.geocoderSvc = new google.maps.Geocoder();
        var methods = {
            get: {
                method: "GET",
                url: $$service.url
            }
        };
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
            $$service.autocompleteSvc.getPlacePredictions({
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
                if (status == google.maps.GeocoderStatus.OK) {
                    deferred.resolve(results[0]);
                } else {
                    deferred.reject("Error getting latlong : " + status);
                }
            }, function(response) {
                $log.error("Error getting latlong: " + response.statusText + " (code: " + response.status + ")");
                deferred.reject("Error getting latlong");
            });
            return deferred.promise;
        };
        $$service.placeDetails = function(placeId) {
            var deferred = $q.defer();
            $$service.placesSvc.getDetails({
                placeId: placeId
            }, function callback(place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    deferred.resolve(place);
                } else {
                    deferred.reject("Error getting place : " + status);
                }
            }, function(response) {
                $log.error("Error getting place: " + response.statusText + " (code: " + response.status + ")");
                deferred.reject("Error getting place");
            });
            return deferred.promise;
        };
        $$service.airportsByAddress = function(address) {
            var deferred = $q.defer();
            if (!address.geometry.location) {
                $$service.latLong(address).then(function(data) {
                    deferred.resolve($$service.airportsByLatlong(data));
                }, function(error) {
                    deferred.reject(error);
                });
            } else {
                deferred.resolve($$service.airportsByLatlong(address));
            }
            return deferred.promise;
        };
        $$service.airportsByLatlong = function(latLong) {
            var deferred = $q.defer();
            var request = {
                location: {
                    lat: latLong.geometry.location.lat(),
                    lng: latLong.geometry.location.lng()
                },
                radius: 5e4,
                query: "airport " + latLong.address_components[0].long_name + " principal",
                type: "airport"
            };
            $$service.placesSvc.textSearch(request, function(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    var airports = [];
                    for (var i = 0; i < results.length; i++) {
                        var result = results[i];
                        if (result.types.length == 3 && !result.permanently_closed) {
                            var airport = {};
                            airport.country = "";
                            airport.city = "";
                            airport.address = result.vicinity;
                            airport.name = result.name;
                            airport.lat = result.geometry.location.lat();
                            airport.lng = result.geometry.location.lng();
                            airport.type = "AIRPORT";
                            airports.push(airport);
                        }
                    }
                    deferred.resolve(airports);
                } else {
                    deferred.reject("Error getting airports : " + status);
                }
            });
            return deferred.promise;
        };
        $$service.trainStationsByAddress = function(address) {
            var deferred = $q.defer();
            if (!address.geometry.location) {
                $$service.latLong(address).then(function(data) {
                    deferred.resolve($$service.trainStationsByLatlong(data));
                }, function(error) {
                    deferred.reject(error);
                });
            } else {
                deferred.resolve($$service.trainStationsByLatlong(address));
            }
            return deferred.promise;
        };
        $$service.trainStationsByLatlong = function(latLong) {
            var deferred = $q.defer();
            var request = {
                location: {
                    lat: latLong.geometry.location.lat(),
                    lng: latLong.geometry.location.lng()
                },
                radius: 5e4,
                query: "train station " + latLong.address_components[0].long_name + " principal",
                type: "train_station"
            };
            $$service.placesSvc.textSearch(request, function(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    var trainStations = [];
                    for (var i = 0; i < results.length; i++) {
                        var result = results[i];
                        if (!result.permanently_closed) {
                            var trainStation = {};
                            trainStation.country = "";
                            trainStation.city = "";
                            trainStation.address = result.vicinity;
                            trainStation.name = result.name;
                            trainStation.lat = result.geometry.location.lat();
                            trainStation.lng = result.geometry.location.lng();
                            trainStation.type = "TRAIN_STATION";
                            trainStations.push(trainStation);
                        }
                    }
                    deferred.resolve(trainStations);
                } else {
                    deferred.reject("Error getting train stations: " + status);
                }
            });
            return deferred.promise;
        };
        return $$service;
    }
})();

(function() {
    "use strict";
    LoadingProgressCtrl.$inject = [ "$scope", "$element", "$mdUtil" ];
    angular.module("itaca.services").component("chLoadingProgress", {
        bindings: {
            message: "@",
            messageKey: "@",
            errorMessage: "@",
            errorMessageKey: "@",
            progressDiameter: "@",
            contClass: "@",
            hideSiblings: "<"
        },
        controller: LoadingProgressCtrl,
        template: '<div flex="100" layout="column" layout-align="center center" class="ch-loading-progress {{$ctrl.contClass}}">' + '<div ng-if="!$ctrl.errorMessage && !$ctrl.errorMessageKey" flex layout="column" layout-padding layout-align="center center">' + "<div>" + '<md-progress-circular class="ch-progress-white" md-mode="indeterminate" md-diameter="{{$ctrl.progressDiameter}}"></md-progress-circular>' + "</div>" + '<div ng-if="$ctrl.message || $ctrl.messageKey" class="text-center">' + '<span ng-if="$ctrl.message" ng-bind="$ctrl.message"></span>' + '<span ng-if="!$ctrl.message && $ctrl.messageKey" translate="{{$ctrl.messageKey}}"></span>' + "</div>" + "</div>" + '<div ng-if="$ctrl.errorMessage || $ctrl.errorMessageKey" flex layout="column" layout-padding layout-align="center center">' + "<div>" + '<md-icon class="mdi mdi-alert-circle-outline md-70 text-white"></md-icon>' + "</div>" + '<div class="md-display-2">Oops...</div>' + "<div>" + '<span ng-if="$ctrl.errorMessage" ng-bind="$ctrl.errorMessage"></span>' + '<span ng-if="!$ctrl.errorMessage && $ctrl.errorMessageKey" translate="{{$ctrl.errorMessageKey}}"></span>' + "</div>" + "</div>" + "</div>"
    });
    function LoadingProgressCtrl($scope, $element, $mdUtil) {
        var ctrl = this;
        this.$postLink = function() {
            ctrl.$hideSiblings(ctrl.hideSiblings);
            ctrl.$disableScroll();
        };
        this.$onInit = function() {
            ctrl.contClass = ctrl.contClass || "bg-primary text-white md-title";
            ctrl.progressDiameter = ctrl.progressDiameter || 150;
        };
        this.$onChanges = function(changesObj) {
            if (changesObj.hideSiblings) {
                ctrl.$hideSiblings(ctrl.hideSiblings);
            }
        };
        this.$onDestroy = function() {
            ctrl.$hideSiblings(false);
            ctrl.$restoreScroll();
        };
        this.$disableScroll = function() {
            ctrl.$restoreScroll = $mdUtil.disableScrollAround($element);
        };
        this.$hideSiblings = function(hide) {
            var children = $element.parent().children();
            hide ? children.addClass("ng-hide") : children.removeClass("ng-hide");
            $element.removeClass("ng-hide");
        };
    }
})();

(function() {
    "use strict";
    LoadingProgressFactory.$inject = [ "$timeout", "HtmlUtils" ];
    angular.module("itaca.services").factory("LoadingProgress", LoadingProgressFactory);
    function LoadingProgressFactory($timeout, HtmlUtils) {
        var $$service = {};
        $$service.start = function(opts) {
            if (!$$service.$$loadingScope) {
                var scope = {
                    $ctrl: angular.merge({}, opts, {
                        active: true
                    })
                };
                var el = '<ch-loading-progress ng-if="$ctrl.active" message="{{$ctrl.message}}" message-key="{{$ctrl.messageKey}}" ' + "error-message=\"{{$ctrl.error ? $ctrl.errorMessage : ''}}\" error-message-key=\"{{$ctrl.error ? $ctrl.errorMessageKey : ''}}\" " + 'icon-class="{{$ctrl.iconClass}}" error-icon-class="{{$ctrl.errorIconClass}}" ' + 'hide-siblings="$ctrl.active" animation-class="animated fadeIn"></ch-loading-progress>';
                $$service.$$loadingScope = HtmlUtils.addElement(el, scope, null, true);
            } else {
                $$service.updateOpts({
                    data: opts
                });
            }
        };
        $$service.stop = function(delay) {
            $timeout(function() {
                $$service.updateOpts({
                    active: false
                });
                $$service.$$loadingScope = undefined;
            }, _.isFinite(delay) ? delay : 0);
        };
        $$service.updateOpts = function(opts, delay) {
            if (!_.isPlainObject(opts)) {
                return;
            }
            if (_.isFinite(delay) && delay > 0) {
                $timeout(function() {
                    $$service.$updateOptsNow(opts);
                }, delay);
            } else {
                $$service.$updateOptsNow(opts);
            }
        };
        $$service.$updateOptsNow = function(opts) {
            if ($$service.$$loadingScope) {
                $$service.$$loadingScope.$ctrl = $$service.$$loadingScope.$ctrl || {};
                _.assign($$service.$$loadingScope.$ctrl, opts);
            }
        };
        return $$service;
    }
})();

(function() {
    "use strict";
    LoadingModalCtrl.$inject = [ "$scope", "$element", "$mdUtil" ];
    angular.module("itaca.services").component("chLoading", {
        bindings: {
            message: "@",
            messageKey: "@",
            progressDiameter: "@",
            contClass: "@"
        },
        controller: LoadingModalCtrl,
        template: '<div flex layout="column" layout-padding layout-align="center center" class="ch-loading-modal {{$ctrl.contClass}}">' + "<div>" + '<md-progress-circular class="md-primary ch-progress" md-mode="indeterminate" md-diameter="{{$ctrl.progressDiameter}}"></md-progress-circular>' + "</div>" + '<div ng-if="$ctrl.message || $ctrl.messageKey" class="text-center">' + '<span ng-if="$ctrl.message" ng-bind="$ctrl.message"></span>' + '<span ng-if="!$ctrl.message && $ctrl.messageKey" translate="{{$ctrl.messageKey}}"></span>' + "</div>" + "</div>"
    });
    function LoadingModalCtrl($scope, $element, $mdUtil) {
        var ctrl = this;
        this.$postLink = function() {
            ctrl.$disableScroll();
        };
        this.$onInit = function() {
            ctrl.contClass = ctrl.contClass || "md-title";
            ctrl.progressDiameter = ctrl.progressDiameter || 80;
        };
        this.$onDestroy = function() {
            ctrl.$restoreScroll();
        };
        this.$disableScroll = function() {
            ctrl.$restoreScroll = $mdUtil.disableScrollAround($element);
        };
    }
})();

(function() {
    "use strict";
    LoadingFactory.$inject = [ "$rootScope", "$timeout", "HtmlUtils" ];
    angular.module("itaca.services").factory("Loading", LoadingFactory);
    function LoadingFactory($rootScope, $timeout, HtmlUtils) {
        var $$service = {};
        $$service.start = function(opts) {
            if (!$$service.$$loadingScope) {
                var scope = {
                    $ctrl: angular.merge({}, opts, {
                        active: true
                    })
                };
                var el = '<ch-loading ng-if="$ctrl.active" message="{{$ctrl.message}}" message-key="{{$ctrl.messageKey}}"' + 'icon-class="{{$ctrl.iconClass}}"></ch-loading>';
                $$service.$$loadingScope = HtmlUtils.addElement(el, scope, null, true);
            } else {
                $$service.updateOpts({
                    data: opts
                });
            }
        };
        $$service.stop = function(delay) {
            $timeout(function() {
                $$service.updateOpts({
                    active: false
                });
                $$service.$$loadingScope = undefined;
            }, _.isFinite(delay) ? delay : 0);
        };
        $$service.updateOpts = function(opts, delay) {
            if (!_.isPlainObject(opts)) {
                return;
            }
            if (_.isFinite(delay) && delay > 0) {
                $timeout(function() {
                    $$service.$updateOptsNow(opts);
                }, delay);
            } else {
                $$service.$updateOptsNow(opts);
            }
        };
        $$service.$updateOptsNow = function(opts) {
            if ($$service.$$loadingScope) {
                $$service.$$loadingScope.$ctrl = $$service.$$loadingScope.$ctrl || {};
                _.assign($$service.$$loadingScope.$ctrl, opts);
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
        this.API = $resource(url, {
            lang: "@lang"
        });
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
    NavigatorFactory.$inject = [ "$http", "$window", "$document", "$animateCss", "$log", "$location", "$timeout", "$anchorScroll", "$mdSidenav", "$state", "$rootScope", "AppOptions" ];
    angular.module("itaca.services").factory("Navigator", NavigatorFactory);
    function NavigatorFactory($http, $window, $document, $animateCss, $log, $location, $timeout, $anchorScroll, $mdSidenav, $state, $rootScope, AppOptions) {
        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }
        var $$service = {};
        $$service.logout = function(url) {
            $log.info("Logging out...");
            url = url || "logout";
            $http.post(url, {}).then(function() {
                $log.info("Logout success. Going back to home...");
            }, function(error) {
                $log.error("Logout failed!");
            }).finally($$service.home);
        };
        $$service.login = function() {
            location.assign("/login");
        };
        $$service.home = function(newPage) {
            newPage ? $window.open("/") : location.assign("/");
        };
        $$service.go = function(url, reload, newPage) {
            reload ? location.assign(url) : newPage ? $window.open(url) : $location.url(url);
        };
        $$service.goBlank = function(url) {
            return $$service.go(url, false, true);
        };
        $$service.goSecure = function(url) {
            location.assign("/secure/" + (url || ""));
        };
        $$service.goToState = function(stateName, params, options) {
            return $state.go(stateName || $state.current, params, options);
        };
        $$service.updateCurrentStateParams = function(params) {
            return $state.go($state.current, angular.merge({}, $state.params, params));
        };
        $$service.reload = function() {
            $window.location.reload();
        };
        $$service.reloadState = function(url, params) {
            if (!url) {
                return $state.reload();
            } else {
                return $state.transitionTo(url, params, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            }
        };
        $$service.reloadHome = function() {
            return $$service.reloadState("home");
        };
        $$service.redirect = function(page, timeout) {
            $timeout(function() {
                $location.url("/" + page);
            }, isFinite(timeout) ? timeout : 5e3);
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
        $$service.scrollToAnchor = function(anchor) {
            if (anchor) {
                anchor = anchor.startsWith("#") ? anchor.substring(1) : anchor;
                $anchorScroll(anchor);
            }
        };
        $$service.top = function(setOnload) {
            window.scrollTo(0, 0);
            if (setOnload) {
                window.onload = function() {
                    window.scrollTo(0, 0);
                };
            }
        };
        $$service.topAnimated = function(setOnload) {
            $$service.scrollToAnimated(document.body, 0, 1250);
            if (setOnload) {
                window.onload = function() {
                    $$service.scrollToAnimated(document.body, 0, 1250);
                };
            }
        };
        $$service.scrollToAnimated = function(element, behavior) {
            var el = angular.element(_.isString(element) ? document.querySelector(element) : element)[0];
            if (!el) {
                return;
            }
            el.scrollIntoView({
                behavior: behavior || "smooth"
            });
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
        $$service.historyBack = function() {
            $window.history.back();
        };
        $$service.back = function(args) {
            AppOptions.page && AppOptions.page.backState ? $$service.goToState(AppOptions.page.backState) : $rootScope.$broadcast("back", args);
        };
        $$service.goBackState = function() {
            $state.go("^");
        };
        $$service.next = function(args) {
            $rootScope.$broadcast("next", args);
        };
        $$service.loadUserDetails = function() {
            $rootScope.$broadcast("loadUserDetails");
        };
        $$service.refreshNotifications = function(type) {
            if (type) {
                $rootScope.$broadcast("refresh-" + type + "-notifications");
            } else {
                $rootScope.$broadcast("refresh-notifications");
            }
        };
        $$service.closeAllNotifications = function() {
            $rootScope.$broadcast("notifications-close");
        };
        $$service.disableNavEffect = function() {
            angular.element(document.querySelector("#navigationDrawer")).addClass("background-no-scroll");
            $rootScope.config = $rootScope.config || {};
            $rootScope.config.navEffectDisabled = true;
        };
        $$service.enableNavEffect = function() {
            angular.element(document.querySelector("#navigationDrawer")).removeClass("background-no-scroll");
            $rootScope.config = $rootScope.config || {};
            $rootScope.config.navEffectDisabled = false;
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

(function() {
    "use strict";
    TemplateFactory.$inject = [ "$resource", "$q" ];
    angular.module("itaca.factory").factory("Template", TemplateFactory);
    function TemplateFactory($resource, $q) {
        var $$service = {};
        $$service.url = "/api/rs/public/template";
        var methods = {
            managersTerms: {
                method: "GET",
                url: $$service.url + "/terms/manager"
            },
            guestsTerms: {
                method: "GET",
                url: $$service.url + "/terms/guest"
            },
            cookies: {
                method: "GET",
                url: $$service.url + "/cookies"
            },
            privacy: {
                method: "GET",
                url: $$service.url + "/privacy/guest"
            },
            aboutUs: {
                method: "GET",
                url: $$service.url + "/aboutUs"
            },
            faq: {
                method: "GET",
                url: $$service.url + "/faq"
            },
            security: {
                method: "GET",
                url: $$service.url + "/security"
            },
            contacts: {
                method: "GET",
                url: $$service.url + "/contacts"
            },
            reviewsGuidelines: {
                method: "GET",
                url: $$service.url + "/reviews/guidelines/guest"
            },
            reviewsInfo: {
                method: "GET",
                url: $$service.url + "/reviews/info"
            },
            reviewsAppInfo: {
                method: "GET",
                url: $$service.url + "/reviews/appinfo"
            }
        };
        $$service.REQUEST = $resource($$service.url, {}, methods);
        $$service.managersTerms = function() {
            var deferred = $q.defer();
            this.REQUEST.managersTerms().$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting terms and conditions");
            });
            return deferred.promise;
        };
        $$service.guestsTerms = function() {
            var deferred = $q.defer();
            this.REQUEST.guestsTerms().$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting terms and conditions");
            });
            return deferred.promise;
        };
        $$service.cookies = function() {
            var deferred = $q.defer();
            this.REQUEST.cookies().$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting cookies");
            });
            return deferred.promise;
        };
        $$service.privacy = function() {
            var deferred = $q.defer();
            this.REQUEST.privacy().$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting privacy");
            });
            return deferred.promise;
        };
        $$service.aboutUs = function() {
            var deferred = $q.defer();
            this.REQUEST.aboutUs().$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting about us");
            });
            return deferred.promise;
        };
        $$service.faq = function() {
            var deferred = $q.defer();
            this.REQUEST.faq().$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting faq");
            });
            return deferred.promise;
        };
        $$service.security = function() {
            var deferred = $q.defer();
            this.REQUEST.security().$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting security");
            });
            return deferred.promise;
        };
        $$service.contacts = function() {
            var deferred = $q.defer();
            this.REQUEST.contacts().$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting contacts");
            });
            return deferred.promise;
        };
        $$service.reviewsGuidelines = function() {
            var deferred = $q.defer();
            this.REQUEST.reviewsGuidelines().$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting reviews guidelines");
            });
            return deferred.promise;
        };
        $$service.reviewsInfo = function() {
            var deferred = $q.defer();
            this.REQUEST.reviewsInfo().$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting reviews info");
            });
            return deferred.promise;
        };
        $$service.reviewsAppInfo = function() {
            var deferred = $q.defer();
            this.REQUEST.reviewsAppInfo().$promise.then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.data && response.data.message ? response.data.message : "Error getting reviews app info");
            });
            return deferred.promise;
        };
        return $$service;
    }
})();

(function() {
    "use strict";
    TransitionsListenerFactory.$inject = [ "$transitions", "$translate", "$log", "InitSrv", "AppOptions", "Navigator", "Loading" ];
    angular.module("itaca.services").factory("TransitionsListener", TransitionsListenerFactory);
    function TransitionsListenerFactory($transitions, $translate, $log, InitSrv, AppOptions, Navigator, Loading) {
        var $$service = {};
        $$service.$$deregisters = {
            onBefore: [],
            onSuccess: [],
            onError: []
        };
        $$service.enable = function() {
            $$service.$$deregisters = {
                onBefore: [],
                onSuccess: [],
                onError: []
            };
            $$service.$$deregisters.onBefore.push($transitions.onBefore({}, startLoading));
            $$service.$$deregisters.onSuccess.push($transitions.onSuccess({}, finishStateChange));
            $$service.$$deregisters.onSuccess.push($transitions.onSuccess({}, stopLoading));
            $$service.$$deregisters.onError.push($transitions.onError({}, finishStateChangeError));
            $$service.$$deregisters.onError.push($transitions.onError({}, stopLoading));
            function nonRootState(state) {
                return !_.isEmpty(state.name);
            }
            function finishStateChange(transition) {
                var toState = transition.to();
                if (_.includes(transition.getResolveTokens(), "title")) {
                    transition.injector().getAsync("title").then(function(title) {
                        AppOptions.page = AppOptions.page || {};
                        AppOptions.page.title = title;
                    }, _.stubFalse);
                } else if (toState.data && toState.data.titleKey) {
                    $translate(angular.isFunction(toState.data.titleKey) ? toState.data.titleKey() : toState.data.titleKey).then(function(message) {
                        AppOptions.page = AppOptions.page || {};
                        AppOptions.page.title = message;
                    }, _.stubFalse);
                }
                if (toState.data && toState.data.menuItem) {
                    AppOptions.page = AppOptions.page || {};
                    AppOptions.page.currentItem = angular.isFunction(toState.data.menuItem) ? toState.data.menuItem() : toState.data.menuItem;
                }
                if (_.isNil(location.hash) || _.isEmpty(location.hash)) {
                    !transition.dynamic() && Navigator.topAnimated(true);
                }
                AppOptions.page = AppOptions.page || {};
                AppOptions.page.hideNav = toState.data && toState.data.hideNav || false;
                AppOptions.page.backBtn = toState.data && toState.data.backBtn || false;
                AppOptions.page.backState = toState.data && toState.data.backState || null;
                AppOptions.page.hideSearch = toState.data && toState.data.hideSearch || false;
                AppOptions.page.hideTopButton = toState.data && toState.data.hideTopButton || false;
                toState.navEffect == false ? Navigator.disableNavEffect() : Navigator.enableNavEffect();
            }
            function finishStateChangeError(transition) {
                var toState = transition.to();
                var error = transition.error();
                if (!toState.redirectTo && !error.redirected && _.includes([ 4, 6 ], error.type)) {
                    $log.error("Error loading page " + toState.url + " (" + toState.name + "): " + error);
                }
            }
            function startLoading(transition) {
                !transition.dynamic() && Loading.start();
            }
            function stopLoading(transition) {
                var toState = transition.to();
                var error = transition.error();
                if (transition.success || !toState.redirectTo && !error.redirected) {
                    !transition.dynamic() && Loading.stop();
                    Navigator.closeLeftMenu();
                }
            }
        };
        $$service.disable = function(type) {
            if (type) {
                var deregisterFnArr = $$service.$$deregisters[type];
                _.forEach(deregisterFnArr, function(deregisterFn) {
                    angular.isFunction(deregisterFn) && deregisterFn();
                });
            } else {
                _.forEach($$service.$$deregisters, function(deregisterFnArr, hookType) {
                    _.forEach(deregisterFnArr, function(deregisterFn) {
                        angular.isFunction(deregisterFn) && deregisterFn();
                    });
                });
            }
        };
        return $$service;
    }
})();