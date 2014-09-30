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
			controller : 'LoginCtrl',
			access : {
				retricted : false
			}
		})
		.otherwise({
			redirectTo : '/dashboard'
		})
	;
});

angular.module('bonitaDashboardApp').config(function (bonitaConfigProvider) {
	bonitaConfigProvider.setBonitaUrl('/bonita');
});

angular.module('bonitaDashboardApp').run(function ($rootScope, $location, $log, bonitaAuthentication) {
	$rootScope.$on('$locationChangeStart', function (scope, currView) {
		if (!bonitaAuthentication.isLogged() && (!currView || !currView.access || currView.access.restricted)) {
			$log.log('user is not logged and access is restricted : redirecting to personal settings (/login)');
			$location.path('/login');
		}
	});
});
