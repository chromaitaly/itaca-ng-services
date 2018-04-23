(function() {
    'use strict';
    
    angular.module("itaca.services").factory('TransitionsListener', TransitionsListenerFactory);
    
    /* @ngInject */
    function TransitionsListenerFactory($transitions, $translate, $log, InitSrv, AppOptions, Navigator, Loading) {
    	var $$service = {};
    	
    	$$service.enable = function() {
    		$transitions.onBefore({}, startLoading);
    		$transitions.onSuccess({}, finishStateChange);
    		$transitions.onSuccess({}, stopLoading);
    		$transitions.onError({}, finishStateChangeError);
    		$transitions.onError({}, stopLoading);
    		
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
    			
    			// torna a inizio pagina
    			if (_.isNil(location.hash) || _.isEmpty(location.hash)) {
    				Navigator.topAnimated(true);
    			}
    			
    			// mostra/nasconde back button
    			AppOptions.page = AppOptions.page || {};
    			// mostra/nasconde nav
    			AppOptions.page.hideNav = (toState.data && toState.data.hideNav) || false;
    			// mostra/nasconde back button
    			AppOptions.page.backBtn = (toState.data && toState.data.backBtn) || false;
    			AppOptions.page.backState = (toState.data && toState.data.backState) || null;
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
    			
    			if (!toState.redirectTo && !error.redirected){
    				$log.error("Error loading page " + toState.url + " (" + toState.name + "): " + error);
    			}
    		}
    		
    		function startLoading(transition) {
    			!transition.dynamic() && Loading.start();
    		}

    		function stopLoading(transition) {
    			var toState = transition.to();
    			var error = transition.error();

    			if (transition.success || (!toState.redirectTo && !error.redirected)) {
    				// stop loading
    				!transition.dynamic() && Loading.stop();
    				// chiude un'eventuale loading-progress attiva
//    				LoadingProgress.stop();
    				// chiusura menu laterale
    				Navigator.closeLeftMenu();
    			}
    		}
    	};
    	
    	return $$service;    	
    }
})();