(function() {
    'use strict';
    
    angular.module("itaca.services").factory("Navigator", NavigatorFactory);
    
    /* @ngInject */
    function NavigatorFactory($http, $window, $document, $animateCss, $log, $location, $timeout, $anchorScroll, $mdSidenav, 
    		$state, $rootScope, AppOptions){
    	
    	// disable browser scroll restore
		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual';
		}
    	
    	var $$service = {};
    	
    	$$service.logout = function(){
    		$log.info("Logging out...");
    		
    		$http.post('logout', {}).then(function() {
    			$log.info("Logout success. Going back to home...");
    			
    		  },function(error) {
    			  $log.error("Logout failed!");
    			  
    		  }).finally($$service.home);
    	};
    	
    	$$service.login = function() {
    		location.assign("/login");
    	};
    	
    	$$service.home = function(newPage) {
			newPage ? $window.open("/") : location.assign("/")
		};
		
    	$$service.go = function(url, reload, newPage){
    		reload ? location.assign(url) : newPage ? $window.open(url) : $location.url(url);
    	};
    	
    	$$service.goBlank = function(url) {
    		$$service.go(url, false, true);
    	};
    	
    	$$service.goSecure = function(url) {
			location.assign("/secure/" + (url || ""));
		};
    	
    	$$service.goToState = function(stateName, params, options) {
    		$state.go(stateName, params, options);
//    		$$service.top();
    	};
    	
    	$$service.updateCurrentStateParams = function(params) {
    		$state.go($state.current, angular.merge({}, $state.params, params));
    	};
    	
    	$$service.reload = function(){
    		$window.location.reload();
    	};
    	
    	$$service.reloadState = function(url, params){
    		if (!url) {
    			$state.reload();
    		
    		} else {
    			$state.transitionTo(url, params, { 
    			  reload: true, inherit: false, notify: true
    			});
    		}
    	};
    	
    	$$service.reloadHome = function() {
    		$$service.reloadState("home");
    	};
    	
    	$$service.redirect = function(page, timeout){
    		$timeout(function() {
    			$location.url('/'+ page);
    		}, isFinite(timeout) ? timeout : 5000);
    	};
    	
    	$$service.goToAnchor = function(anchor) {
    		if (anchor) {
    			// rimuovo l'eventuale # iniziale
    			anchor = anchor.startsWith("#") ? anchor.substring(1) : anchor;
    			// scrollo
    			var id = document.getElementById(anchor);
    			if(id != null){
    				$document.scrollToElementAnimated(angular.element(id));
    			}
    		}
    	};
    	
    	$$service.scrollToAnchor = function(anchor) {
    		if (anchor) {
    			// rimuovo l'eventuale # iniziale
    			anchor = anchor.startsWith("#") ? anchor.substring(1) : anchor;
    			// scrollo
    			$anchorScroll(anchor);
    		}
    	};
    	
    	$$service.top = function(setOnload){
    		window.scrollTo(0, 0);
    		
    		if (setOnload) {
    			window.onload = function(){
    				window.scrollTo(0, 0);
    			};
    		}
    	};
    	
    	$$service.topAnimated = function(setOnload) {
    		$$service.scrollToAnimated(document.body, 0, 1250);
//    		$document.scrollTopAnimated(0);
    		
    		if (setOnload) {
    			window.onload = function(){
//    				$document.scrollTopAnimated(0);
    				$$service.scrollToAnimated(document.body, 0, 1250);
    			};
    		}
    	};
    	
    	$$service.scrollToAnimated = function(element, behavior) {
    		var el = angular.element(element)[0];
    		
    		if (!el) {
    			return;
    		}
    		
    		el.scrollIntoView({ 
    			"behavior": behavior || 'smooth' 
			});
    	};
    	
    	$$service.toggleLeftMenu = function() {
    		$mdSidenav('leftMenu').toggle();
    		AppOptions.hideLeftMenu = !AppOptions.hideLeftMenu;
    	};
    	
    	$$service.closeLeftMenu = function(keepClosed) {
    		$mdSidenav('leftMenu').close();
    		AppOptions.hideLeftMenu = keepClosed;
    	};
    	
    	$$service.isLeftMenuOpen = function() {
    		return $mdSidenav('leftMenu').isOpen();
    	};
    	
    	$$service.historyBack = function(){
    		$window.history.back();
    	};
    	
    	$$service.back = function(args){
    		AppOptions.page && AppOptions.page.backState ? $$service.goToState(AppOptions.page.backState) : $rootScope.$broadcast('back', args);
    	};
    	
    	$$service.next = function(args){
    		$rootScope.$broadcast('next', args);
    	};
    	
    	$$service.loadUserDetails =  function() {
			$rootScope.$broadcast("loadUserDetails");
		};
		
		$$service.refreshNotifications = function(type) {
			if (type) {
				$rootScope.$broadcast("refresh-" + type  + "-notifications");
				
			} else {
				$rootScope.$broadcast("refresh-notifications");
			}
		};
		
		$$service.closeAllNotifications = function() {
			$rootScope.$broadcast('notifications-close');
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