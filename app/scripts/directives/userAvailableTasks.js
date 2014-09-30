'use strict';

angular.module('bonitaDashboardApp').directive('userAvailableTasks', function () {
	return {
		restrict : 'E',
		templateUrl : 'directives/user-available-tasks.html'
	};
});
