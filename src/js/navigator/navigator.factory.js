(function() {
    'use strict';
    
    angular.module("itaca.services").factory("Navigator", NavigatorFactory);
    
    /* @ngInject */
    function NavigatorFactory($http, $window, $document, $log, $location, $timeout, $anchorScroll, $mdSidenav, $state, $rootScope){
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
    	
    	$$service.home = function(){
    		location.assign("/");
    	};
    	
    	$$service.go = function(url, reload, newPage){
    		reload ? location.assign(url) : newPage ? $window.open(url) : $location.url(url);
    	};
    	
    	$$service.goToState = function(stateName, params, options) {
    		$state.go(stateName, params, options);
//    		$$service.top();
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
    	
    	$$service.redirect = function(page){
    		$timeout(function() {
    			$location.url('/'+ page);
    		}, 5000);

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
    	
    	service.scrollToAnchor = function(anchor) {
    		if (anchor) {
    			// rimuovo l'eventuale # iniziale
    			anchor = anchor.startsWith("#") ? anchor.substring(1) : anchor;
    			// scrollo
    			$anchorScroll(anchor);
    		}
    	};
    	
    	$$service.top = function(setOnload){
    		$document.scrollTopAnimated(0);
    		
    		if (setOnload) {
    			window.onload = function(){
    				$document.scrollTopAnimated(0);
    			};
    		}
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
    	
    	$$service.top = function(){
    		$document.scrollTopAnimated(0);
    	};
    	
    	$$service.historyBack = function(){
    		$window.history.back();
    	};
    	
    	$$service.back = function(){
    		$rootScope.$broadcast('back');
    	};
    	
    	$$service.next = function(args){
    		$rootScope.$broadcast('next', args);
    	};
    	
    	$$service.loadUserDetails =  function() {
			$rootScope.$broadcast("loadUserDetails");
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