'use strict';

angular.module('dashboard').directive('userAvailableTasks', function () {
	return {
		restrict : 'E',
		templateUrl : 'directives/user-available-tasks.html'
	};
});
