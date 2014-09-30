'use strict';

angular.module('bonitaDashboardApp').controller('LoginCtrl', function ($scope, $window, bonitaAuthentication) {
	$scope.logginFailure = false;
	$scope.isLoading = false;

	$scope.login = function (username, password) {
		$scope.isLoading = true;
		bonitaAuthentication.login(username, password).then(function () {
			$window.history.back();
		})['catch'](function () {
			$scope.logginFailure = true;
		})['finally'](function () {
			$scope.isLoading = false;
		});
	};
});
