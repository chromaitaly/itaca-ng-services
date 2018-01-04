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
    	
    	$$service.start = function(opts) {
    		if (!$$service.$$loadingScope) {
    			var scope = {data: opts, active: true};
    			
    			var el = "<ch-loading-progress ng-if=\"data.active\" message=\"data.message\" message-key=\"data.messageKey\" " +
    					"error-message=\"data.error ? data.errorMessage : ''\" error-message-key=\"data.error ? data.errorMessageKey : ''\" " +
    					"hide-siblings=\"active\"></ch-loading-progress>";
    			
    			$$service.$$loadingScope = HtmlUtils.addElement(el, scope, null, true);
    		
    		} else {
    			$$service.updateOpts({data: opts});
    		}
    	};
    	
    	$$service.stop = function(error, delay) {
    		$$service.updateOpts({error: _.isBoolean(error) ? error : !_.isNil(error)});
    		
    		$timeout(function() {
    			$$service.updateOpts({active: false});
    			
    		}, delay || 0);
    	};
    	
    	$$service.updateOpts = function(opts) {
    		if (!_.isPlainObject(opts)) {
    			return;
    		}
    		
    		if ($$service.$$loadingScope) {
    			_.assign($$service.$$loadingScope, opts);
    		}
    	};
    	
    	return $$service;
    }
})();