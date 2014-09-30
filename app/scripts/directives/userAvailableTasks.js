'use strict';

angular.module('bonitaDashboardApp').directive('userAvailableTasks', function () {
	return {
		restrict : 'E',
		templateUrl : 'views/directives/user-available-tasks.html'
	};
});
