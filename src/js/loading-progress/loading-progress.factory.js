/**
 * Loading Progress Service
 * 
 */
(function() {
    'use strict';
    
    angular.module("itaca.services").factory('LoadingProgress', LoadingProgressFactory);
    
    /* @ngInject */
    function LoadingProgressFactory($timeout, HtmlUtils){
    	var $$service = {};
    	
    	var emptyCtrl = {active: false, message: null, messageKey: null, error: null, errorMessage: null, errorMessageKey: null, iconClass: null, errorIconClass: null};
    	
    	$$service.start = function(opts) {
    		if (!$$service.$$loadingScope) {
    			var scope = {$ctrl: angular.merge({}, emptyCtrl, opts, {active: true})};
    			
    			var el = "<ch-loading-progress ng-if=\"$ctrl.active\" message=\"$ctrl.message\" message-key=\"$ctrl.messageKey\" " +
    					"error-message=\"$ctrl.error ? $ctrl.errorMessage : ''\" error-message-key=\"$ctrl.error ? $ctrl.errorMessageKey : ''\" " +
    					"icon-class=\"{{$ctrl.iconClass}}\" error-icon-class=\"{{$ctrl.errorIconClass}}\" " +
    					"hide-siblings=\"$ctrl.active\" animation-class=\"animated fadeIn\"></ch-loading-progress>";
    			
    			$$service.$$loadingScope = HtmlUtils.addElement(el, scope, null, true);
    		
    		} else {
    			$$service.updateOpts(angular.merge({}, emptyCtrl, opts, {active: true}));
    		}
    	};
    	
    	$$service.stop = function(delay) {
    		if (_.isFinite(delay) && delay) {
	    		$timeout(function() {
	    			$$service.updateOpts(emptyCtrl);
	    			
	    		}, delay);
	    		
    		} else {
    			$$service.updateOpts(emptyCtrl);
    		}
    	};
    	
    	$$service.isActive = function() {
    		return $$service.$$loadingScope && $$service.$$loadingScope.$ctrl && $$service.$$loadingScope.$ctrl.active;
    	};
    	
    	$$service.updateOpts = function(opts, delay) {
    		if (!_.isPlainObject(opts)) {
    			return;
    		}
    		
    		if (_.isFinite(delay) && delay) {
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