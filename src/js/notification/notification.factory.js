/**
 * Servizio per le notifiche toast / snackbar
 * 
 */
(function() {
    'use strict';
    
    angular.module("itaca.services").factory('Notification', NotificationFactory);
    
    /* @ngInject */
    function NotificationFactory($mdToast, $mdMedia) {
    	var $$service = {};
    	
    	$$service.message = function(message, onHideFunc, btnText) {
    		var position = $mdMedia('gt-sm') ? "top right" : "top";
    		$$service.showSimple(message, onHideFunc, btnText, position, 'toast-fixed', true);
    	};
    	
    	$$service.error = function(message, onHideFunc) {
    		var position = $mdMedia('gt-sm') ? "top right" : "top";
    		$$service.showSimple(message, onHideFunc, null, position,'toast-fixed', false);
    	};
    		
    	$$service.showSimple = function(message, onHideFunc, btnText, position, fixed, /** Boolean */ capsule) {
    		var toast = $mdToast.simple()
    			.textContent(message)
    			.toastClass(fixed)
    			.position(position)
    			.capsule(capsule);
    		
    		if (angular.isDefined(btnText)) {
    			toast.action(btnText);
    		}
    		
    		$mdToast.show(toast).then(function(response) {
    			if (angular.isFunction(onHideFunc)) {
    				onHideFunc(response);
    			}				
    		},_.stubFalse);
    	};
    	
    	return $$service;
    }
})();