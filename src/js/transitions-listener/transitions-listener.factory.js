(function() {
    'use strict';
    
    angular.module("itaca.services").factory('TransitionsListener', TransitionsListenerFactory);
    
    /* @ngInject */
    function TransitionsListenerFactory($transitions, $translate, $log, $mdDialog, $location, InitSrv, AppOptions, Navigator, Loading, LoadingProgress) {
    	var $$service = {}; 
    	
    	$$service.$$deregisters = {onBefore: [], onSuccess: [], onError: []};
    	
    	$$service.enable = function() {
    		$$service.$$deregisters = {onBefore: [], onSuccess: [], onError: []};
    		
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
    	
    			} else if (_.includes(transition.getResolveTokens(), "titleKey")) {
    				transition.injector().getAsync("titleKey").then(function(titleKey) {
    					$translate(titleKey).then(function(message) {
        					AppOptions.page = AppOptions.page || {};
        					AppOptions.page.title = message;
        				}, _.stubFalse);
    				}, _.stubFalse);
    				
    			} else if (toState.data && toState.data.titleKey) {
    				$translate(angular.isFunction(toState.data.titleKey) ? toState.data.titleKey() : toState.data.titleKey).then(function(message) {
    					AppOptions.page = AppOptions.page || {};
    					AppOptions.page.title = message;
    				}, _.stubFalse);
    			}
    			
    			AppOptions.page = AppOptions.page || {};
    			
    			if (toState.data && toState.data.menuItem) {
    				AppOptions.page.currentItem = angular.isFunction(toState.data.menuItem) ? toState.data.menuItem() : toState.data.menuItem;
    			}
    			
    			// torna a inizio pagina
    			if (_.isNil(location.hash) || _.isEmpty(location.hash)) {
    				!transition.dynamic() && Navigator.topAnimated(true);
    			}
    			
    			// mostra/nasconde back button
    			AppOptions.page.backBtn = (toState.data && toState.data.backBtn) || false;
    			AppOptions.page.backState = null;
    			AppOptions.page.backText = toState.data && toState.data.backText ? toState.data.backText : null; 
    			
    			if (_.includes(transition.getResolveTokens(), "backState")) {
    				AppOptions.page = AppOptions.page || {};
					AppOptions.page.backState = transition.injector().get("backState");
    			
    			} else if (toState.data && toState.data.backState) {
					AppOptions.page.backState = toState.data.backState;
    			}
    			
    			// mostra/nasconde nav
    			AppOptions.page.hideNav = (toState.data && toState.data.hideNav) || false;
    			// mostra/nasconde search button
    			AppOptions.page.hideSearch = (toState.data && toState.data.hideSearch) || false;
    			// nasconde/mostra il go-to-top button
    			AppOptions.page.hideTopButton = (toState.data && toState.data.hideTopButton) || false;
    			
    			// abilita/disabilita effetto su nav
    			toState.navEffect == false ? Navigator.disableNavEffect() : Navigator.enableNavEffect();
    		}
    		
    		function finishStateChangeError(transition) {
    			var toState = transition.to();
    			var error = transition.error();
    			
    			if (!toState.redirectTo && !error.redirected && _.includes([4, 6], error.type)){
    				$log.error("Error loading page " + toState.url + " (" + toState.name + "): " + error);
    			}
    		}
    		
    		function startLoading(transition) {
    			if (!transition.dynamic() && !transition.to().isDialog) {
    				// chiudo eventuale dialog
    				$mdDialog.cancel(transition.to());
    				// start loading
    				!LoadingProgress.isActive() && Loading.start();
    			}
    		}

    		function stopLoading(transition) {
    			var toState = transition.to();
    			var error = transition.error();

    			if (transition.success || (!toState.redirectTo && !error.redirected)) {
    				// stop loading
    				!transition.dynamic() && !toState.isDialog && Loading.stop();
    				// chiude un'eventuale loading-progress attiva
//    				LoadingProgress.stop();
    				// chiusura menu laterale
    				Navigator.closeLeftMenu();
    			}
    		}
    	};
    	
    	$$service.disable = function(type) {
    		if (type) {
    			// deregister specific hooks
    			var deregisterFnArr = $$service.$$deregisters[type];
    			
    			_.forEach(deregisterFnArr, function(deregisterFn) {
					// deregister
					angular.isFunction(deregisterFn) && deregisterFn();
				});
    			
    		} else {
    			// deregister all hooks
    			_.forEach($$service.$$deregisters, function(deregisterFnArr, hookType) {
    				_.forEach(deregisterFnArr, function(deregisterFn) {
    					// deregister
    					angular.isFunction(deregisterFn) && deregisterFn();
    				});
    			});
    		}
    	};
    	
    	return $$service;    	
    }
})();