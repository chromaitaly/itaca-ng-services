(function() {
	'use strict';
	
	angular.module("itaca.services").component('chLoadingProgress', {
		bindings: {
			message: "<",
			messageKey: "<",
			errorMessage: "<",
			errorMessageKey: "<",
			iconClass: "@",
			errorIconClass: "@",
			alertMessage: "<?",
			alertMessageKey: "<?",
			hideAlert: "<?",
			progressDiameter: "@",
			contClass: "@",
			hideSiblings: "<",
			animationClass: "@"
		},
		controller: LoadingProgressCtrl,
		template: 
			"<div flex=\"100\" layout=\"column\" class=\"ch-loading-progress text-center {{$ctrl.contClass}}\">" +
				"<div ng-if=\"!$ctrl.errorMessage && !$ctrl.errorMessageKey\" flex layout=\"column\" layout-padding layout-align=\"center center\">" +
					"<div ng-if=\"!$ctrl.iconClass\">" +
						"<md-progress-circular class=\"ch-progress-white\" md-mode=\"indeterminate\" md-diameter=\"{{$ctrl.progressDiameter}}\"></md-progress-circular>" +
					"</div>" +
					"<div ng-if=\"$ctrl.iconClass\">" +
						"<md-icon class=\"material-icons {{$ctrl.iconClass}}\"></md-icon>" +
					"</div>" +
					"<div ng-if=\"$ctrl.message || $ctrl.messageKey\" class=\"text-center\">" +
						"<span ng-if=\"$ctrl.message\" ng-bind=\"$ctrl.message\"></span>" +
						"<span ng-if=\"!$ctrl.message && $ctrl.messageKey\" translate=\"{{$ctrl.messageKey}}\"></span>" +
					"</div>" +
				"</div>" +
				"<div ng-if=\"$ctrl.errorMessage || $ctrl.errorMessageKey\" flex layout=\"column\" layout-padding layout-align=\"center center\">" +
					"<div>" +
						"<md-icon class=\"material-icons {{$ctrl.errorIconClass}}\"></md-icon>" +
					"</div>" +
					"<div class=\"md-display-2\">Oops...</div>" +
					"<div>" +
						"<span ng-if=\"$ctrl.errorMessage\" ng-bind=\"$ctrl.errorMessage\"></span>" +
						"<span ng-if=\"!$ctrl.errorMessage && $ctrl.errorMessageKey\" translate=\"{{$ctrl.errorMessageKey}}\"></span>" +
					"</div>" +
				"</div>" +
				"<div ng-if=\"$ctrl.hideAlert\" layout=\"column\" layout-padding layout-align=\"center center\">" +
					"<div ng-if=\"$ctrl.alertMessage || $ctrl.alertMessageKey\" class=\"text-center\">" +
						"<small ng-if=\"$ctrl.alertMessage\" ng-bind=\"$ctrl.alertMessage\"></small>" +
						"<small ng-if=\"!$ctrl.alertMessage && $ctrl.alertMessageKey\" translate=\"{{$ctrl.alertMessageKey}}\">Don't close this window</small>" +
					"</div>" +
				"</div>" +
			"</div>"
	});

	/* @ngInject */
	function LoadingProgressCtrl($scope, $element, $mdUtil) {
		var ctrl = this;
		
		this.$postLink = function() {
			ctrl.$hideSiblings(ctrl.hideSiblings);
			ctrl.$disableScroll();
		};
		
		this.$onInit = function() {
			ctrl.contClass = ctrl.contClass || "bg-primary text-white md-title";
			ctrl.errorIconClass = ctrl.errorIconClass || "mdi mdi-alert-circle-outline md-70 text-white";
			ctrl.progressDiameter = ctrl.progressDiameter || 150;
			
			ctrl.alertMessageKey = ctrl.alertMessageKey || "common.dont.close.window";
		};
		
		this.$onDestroy = function() {
			ctrl.$hideSiblings(false);
			ctrl.$restoreScroll();
		};
		
		this.$disableScroll = function() {
			ctrl.$restoreScroll = $mdUtil.disableScrollAround($element);
		};
		
		this.$hideSiblings = function(hide) {
			var children = $element.parent().children();
			
			// nascondo tutti i nodi figli
			hide ? children.addClass("ng-hide " + ctrl.animationClass) : children.removeClass("ng-hide");
			// mostro il nodo del loading
			$element.removeClass("ng-hide");
		};
	}
})();