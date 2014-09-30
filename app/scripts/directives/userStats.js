'use strict';

angular.module('bonitaDashboardApp').directive('userStats', function (User, HumanTask, ArchivedHumanTask, bonitaConfig, ProcessDefinition, ProcessInstance, ArchivedProcessInstance) {
	return {
		restrict : 'E',
		templateUrl : 'views/directives/user-stats.html',
		scope : {},
		link : function (scope) {
			// Load user data
			User.get({
				id : bonitaConfig.getUserId()
			}).$promise.then(function (user) {
				scope.firstname = user.firstname;
				scope.lastname = user.lastname;
			});

			// Load open tasks
			HumanTask.getFromCurrentUser({
				p : 0,
				c : 5,
				d : 'rootContainerId'
			}).$promise.then(function (tasks) {
				scope.totalTasksToDo = tasks.totalCount;
			});

			// Load archived tasks
			ArchivedHumanTask.getCompletedByCurrentUser({
				p : 0,
				c : 5,
				d : 'rootContainerId'
			}).$promise.then(function (archivedTasks) {
				scope.totalArchivedTasks = archivedTasks.totalCount;
			});

			// Load apps
			ProcessDefinition.getStartableByCurrentUser({
				p : 0,
				c : 5,
				d : 'deployedBy'
			}).$promise.then(function (apps) {
				scope.totalAppsAvailable = apps.totalCount;
			});

			// Load cases
			ProcessInstance.getStartedByCurrentUser({
				p : 0,
				c : 5,
				d : 'processDefinitionId'
			}).$promise.then(function (cases) {
				scope.totalCasesOpen = cases.totalCount;
			});

			// Load archived cases
			ArchivedProcessInstance.getStartedByCurrentUser({
				p : 0,
				c : 5,
				d : 'processDefinitionId'
			}).$promise.then(function (archivedCases) {
				scope.totalArchivedCases = archivedCases.totalCount;
			});
		}
	};
});
