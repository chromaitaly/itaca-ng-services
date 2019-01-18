(function() {
	'use strict';
	
	angular.module("itaca.components").component('chLoading', {
		bindings: {
			message: "@",
			messageKey: "@",
			progressDiameter: "@",
			contClass: "@",
			siblingsClass: "@"
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
			ctrl.$manageSiblings(!_.isNil(ctrl.siblingsClass));
		};
		
		this.$onInit = function() {
			ctrl.contClass = ctrl.contClass || "md-title";
			ctrl.progressDiameter = ctrl.progressDiameter || 80;
		};
		
		this.$onChanges = function(changesObj) {
			if (changesObj.siblingsClass) {
				ctrl.$manageSiblings(!_.isNil(ctrl.siblingsClass));
			}
		};
		
		this.$onDestroy = function() {
			ctrl.$manageSiblings(false);
			ctrl.$restoreScroll();
		};
		
		this.$disableScroll = function() {
			ctrl.$restoreScroll = $mdUtil.disableScrollAround($element);
		};
		
		this.$manageSiblings = function(apply) {
			var children = $element.parent().children();
			
			// nascondo tutti i nodi figli
			apply ? children.addClass(ctrl.siblingsClass) : children.removeClass(ctrl.siblingsClass);
			// mostro il nodo del loading
			$element.removeClass(ctrl.siblingsClass);
		};
	}
})();