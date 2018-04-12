(function() {
	'use strict';
	
	angular.module("itaca.services").component('chLoading', {
		bindings: {
			message: "@",
			messageKey: "@",
			progressDiameter: "@",
			contClass: "@"
		},
		controller: LoadingModalCtrl,
		template: 
			"<div flex layout=\"column\" layout-padding layout-align=\"center center\" class=\"ch-loading-modal {{$ctrl.contClass}}\">" +
				"<div>" +
					"<md-progress-circular class=\"md-primary ch-progress\" md-mode=\"indeterminate\" md-diameter=\"{{$ctrl.progressDiameter}}\"></md-progress-circular>" +
				"</div>" +
				"<div ng-if=\"$ctrl.message || $ctrl.messageKey\" class=\"text-center\">" +
					"<span ng-if=\"$ctrl.message\" ng-bind=\"$ctrl.message\"></span>" +
					"<span ng-if=\"!$ctrl.message && $ctrl.messageKey\" translate=\"{{$ctrl.messageKey}}\"></span>" +
				"</div>" +
			"</div>"
	});

	/* @ngInject */
	function LoadingModalCtrl($scope, $element, $mdUtil) {
		var ctrl = this;
		
		this.$postLink = function() {
			ctrl.$disableScroll();
		};
		
		this.$onInit = function() {
			ctrl.contClass = ctrl.contClass || "md-title";
			ctrl.progressDiameter = ctrl.progressDiameter || 80;
		};
		
		this.$onDestroy = function() {
			ctrl.$restoreScroll();
		};
		
		this.$disableScroll = function() {
			ctrl.$restoreScroll = $mdUtil.disableScrollAround($element);
		};
	}
})();