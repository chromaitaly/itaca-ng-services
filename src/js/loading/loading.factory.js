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
    		if (!$$service.$$loadingScope) {
    			var scope = {$ctrl: angular.merge({}, opts, {active: true})};
    			
    			var el = "<ch-loading-modal ng-if=\"$ctrl.active\" message=\"$ctrl.message\" message-key=\"$ctrl.messageKey\"" +
    					"icon-class=\"{{$ctrl.iconClass}}\"></ch-loading-modal>";
    			
    			$$service.$$loadingScope = HtmlUtils.addElement(el, scope, null, true);
    		
    		} else {
    			$$service.updateOpts({data: opts});
    		}
    	};
    	
    	$$service.stop = function(delay) {
    		$timeout(function() {
    			$$service.updateOpts({active: false});
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
    			$$service.$updateOptsNow(opts)
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