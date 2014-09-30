'use strict';

angular.module('bonitaDashboardApp').directive('userOpenCases', function (ProcessInstance) {
	return {
		restrict : 'E',
		templateUrl : 'views/directives/user-open-cases.html',
		scope : {},
		link : function (scope) {
			// Load cases
			ProcessInstance.getStartedByCurrentUser({
				p : 0,
				c : 5,
				d : 'processDefinitionId'
			}).$promise.then(function (cases) {
				scope.cases = cases.items;
			});

			scope.getDate = function (date) {
				return new Date(date).toLocaleString();
			};
		}
	};
});
