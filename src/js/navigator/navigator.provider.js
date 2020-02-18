(function() {
    'use strict';
    
    angular.module("itaca.services").provider("Navigator", NavigatorProvider);
    
    function NavigatorProvider() {
		var $$offset = 0;

		this.init = function(offset) {
			this.setDefaultOffset(offset);
		};
		
		this.setDefaultOffset = function(/* Top-offset pixels */ offset) {
			if (_.isFinite(offset)) {
				$$offset = offset;
			}
		};
		
		this.$get = /* @ngInject */ function($q, $http, $window, $document, $animateCss, $log, $location, $timeout, $anchorScroll, $mdSidenav, 
	    		$state, $rootScope, AppOptions) {
			return new Navigator($q, $http, $window, $document, $animateCss, $log, $location, $timeout, $anchorScroll, $mdSidenav, 
		    		$state, $rootScope, AppOptions, $$offset);
		};
	}
    
    function Navigator($q, $http, $window, $document, $animateCss, $log, $location, $timeout, $anchorScroll, $mdSidenav, 
    		$state, $rootScope, AppOptions, offset){
    	
    	// disable browser scroll restore
		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual';
		}
    	
    	var $$service = {offset: _.isFinite(offset) ? offset : 0};
    	
    	$$service.logout = function(url){
    		$log.info("Logging out...");
    		
    		url = url || 'logout';
    		
    		$http.post(url, {}).then(function() {
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
    		return $$service.go(url, false, true);
    	};
    	
    	$$service.goSecure = function(url) {
			location.assign("/secure/" + (url || ""));
		};
    	
    	$$service.goToState = function(stateName, params, options) {
    		return $state.go(stateName || $state.current, params, options);
//    		$$service.top();
    	};
    	
    	$$service.updateCurrentStateParams = function(params) {
    		return $state.go($state.current, angular.merge({}, $state.params, params));
    	};
    	
    	$$service.reload = function(){
    		$window.location.reload();
    	};
    	
    	$$service.reloadState = function(url, params){
    		if (!url) {
    			return $state.reload();
    		
    		} else {
    			return $state.transitionTo(url, params, { 
    			  reload: true, inherit: false, notify: true
    			});
    		}
    	};
    	
    	$$service.reloadHome = function() {
    		return $$service.reloadState("home");
    	};
    	
    	$$service.redirect = function(page, timeout){
    		$timeout(function() {
    			$location.url('/'+ page);
    		}, isFinite(timeout) ? timeout : 5000);
    	};
    	
    	$$service.goToAnchor = function(anchor, offset) {
    		if (anchor) {
    			// rimuovo l'eventuale # iniziale
    			anchor = anchor.startsWith("#") ? anchor.substring(1) : anchor;
    			// scrollo
    			var id = document.getElementById(anchor);
    			if(id != null){
    				$document.scrollToElementAnimated(angular.element(id), offset && _.isFinite(parseInt(offset)) ? parseInt(offset) : $$service.offset);
    			}
    		}
    	};
    	
    	$$service.scrollToAnchor = function(anchor, offset) {
    		if (anchor) {
    			// rimuovo l'eventuale # iniziale
    			anchor = anchor.startsWith("#") ? anchor.substring(1) : anchor;
    			
    			// memorizzo offset originale
    			var oriOffset = $anchorScroll.yOffset;
    			// imposto l'offset
    			$anchorScroll.yOffset = offset && _.isFinite(parseInt(offset)) ? parseInt(offset) : $$service.offset;
    			// scrollo
    			$anchorScroll(anchor);
    			// reimposto l'offset originale
    			$anchorScroll.yOffset = oriOffset;
    		}
    	};
    	
    	$$service.top = function(setOnload){
    		window.scrollTo(0, 0);
    		
    		_.forEach(document.querySelectorAll('*[ui-view]'), function(el){
    			el.scrollTop = 0;
    		});
    		
    		if (setOnload) {
    			window.onload = function(){
    				window.scrollTo(0, 0);
    				
    				_.forEach(document.querySelectorAll('*[ui-view]'), function(el){
    					el.scrollTop = 0;
    	    		});
    			};
    		}
    	};
    	
    	$$service.topAnimated = function(setOnload) {
    		$$service.scrollToAnimated(document.body, 0, 1250);
//    		$document.scrollTopAnimated(0);
    		
    		_.forEach(document.querySelectorAll('*[ui-view]'), function(el){
    			el.scrollTop = 0;
    		});
    		
    		if (setOnload) {
    			window.onload = function(){
//    				$document.scrollTopAnimated(0);
    				$$service.scrollToAnimated(document.body, 0, 1250);
    				
    				_.forEach(document.querySelectorAll('*[ui-view]'), function(el){
    					el.scrollTop = 0;
    	    		});
    				
    			};
    		}
    	};
    	
    	$$service.scrollToAnimated = function(element, behavior) {
    		var el = angular.element( _.isString(element) ? document.querySelector(element) : element)[0];
    		
    		if (!el) {
    			return;
    		}
    		
    		el.scrollIntoView({ 
    			block: "start", 
    			inline: "nearest",
    			"behavior": behavior || 'smooth' 
			});
    	};
    	
    	$$service.toggleLeftMenu = function() {
    		$q.when($mdSidenav('leftMenu', true)).then(function(instance) {
    			instance.toggle();
	    		AppOptions.hideLeftMenu = !AppOptions.hideLeftMenu;
    		});
    	};
    	
    	$$service.closeLeftMenu = function(keepClosed) {
    		$q.when($mdSidenav('leftMenu', true)).then(function(instance) {
    			instance.close();
    			if (_.isBoolean(keepClosed)) {
    				AppOptions.hideLeftMenu = keepClosed;
    				$rootScope.$broadcast(keepClosed ? 'left-menu-closed' : 'left-menu-open');
    			}
    		});
    	};
    	
    	$$service.isLeftMenuOpen = function() {
    		return $q.when($mdSidenav('leftMenu', true)).then(function(instance) {
    			return instance.isOpen();
    		});
    	};
    	
    	$$service.historyBack = function(){
    		$window.history.back();
    	};
    	
    	$$service.back = function(args){
    		AppOptions.page && AppOptions.page.backState ? $$service.goToState(AppOptions.page.backState) : $rootScope.$broadcast('back', args);
    	};
    	
    	$$service.goBackState = function() {
    		$state.go("^");
    	};
    	
    	$$service.next = function(args){
    		$rootScope.$broadcast('next', args);
    	};
    	
    	$$service.loadUserDetails =  function() {
			$rootScope.$broadcast("loadUserDetails");
		};
		
		$$service.refreshLocale =  function() {
			$rootScope.$broadcast("locale-changed");
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