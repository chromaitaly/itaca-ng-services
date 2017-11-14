/**
 * Loading Service
 * 
 */
(function() {
    'use strict';
    
    angular.module("itaca.services").factory('Loading', LoadingFactory);
    
    /* @ngInject */
    function LoadingFactory($rootScope, $timeout, HtmlUtils){
    	var $$service = {};
    	
    	$$service.start = function(opts) {
    		if (!$$service.$$loadingEl) {
    			var scope = {data: opts, active: true};
    			
    			var el = "<ch-loading-progress ng-if=\"data.active\" message=\"data.message\" message-key=\"data.messageKey\"></ch-loading-progress>";
    			
    			$$service.$$loadingEl = HtmlUtils.addElement(el, scope, null, true);
    		
    		} else {
    			$$service.updateOpts({data: opts});
    		}
    	};
    	
    	$$service.stop = function(error, delay) {
    		$timeout(function() {
    			$$service.updateOpts({active: false});
    			
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