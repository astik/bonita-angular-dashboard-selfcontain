'use strict';

angular.module('bonitaDashboardApp', [ 'ngCookies', 'ngRoute', 'ui.bootstrap', 'ngBonita' ]);

angular.module('bonitaDashboardApp').config(function ($routeProvider) {
	$routeProvider
		.when('/dashboard', {
			templateUrl : 'views/dashboard.html',
			controller : 'DashboardCtrl'
		})
		.when('/login', {
			templateUrl : 'views/login.html',
			controller : 'LoginCtrl'
		})
		.otherwise({
			redirectTo : '/dashboard'
		})
	;
});

angular.module('bonitaDashboardApp').config(function (bonitaConfigProvider) {
	bonitaConfigProvider.setBonitaUrl('/bonita');
});
