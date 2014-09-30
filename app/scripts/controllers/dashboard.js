'use strict';

angular.module('bonitaDashboardApp').controller('dashboardCtrl',
		function ($scope, $log, $modal, bonitaAuthentication, bonitaConfig, BonitaSession, User, HumanTask, ArchivedHumanTask, ProcessDefinition, ProcessInstance, ArchivedProcessInstance) {
			// Logs into Bonita as 'walter.bates'
			bonitaAuthentication.login('walter.bates', 'bpm').then(function () {
				// Prepare scope
				$scope.showRest = [];
				$scope.loggedUser = null;
				$scope.totalTasksToDo = null;
				$scope.totalArchivedTasksToDo = null;
				$scope.totalAppsAvailable = null;
				$scope.totalCasesOpen = null;
				$scope.totalArchivedCase = null;
				$scope.firstname = null;
				$scope.lastname = null;

				// Load data using ngBonita resources
				$scope.loggedUser = bonitaConfig.getUserId();

				// Load user data
				User.get({
					id : bonitaConfig.getUserId()
				}).$promise.then(function (user) {
					$scope.firstname = user.firstname;
					$scope.lastname = user.lastname;
				});

				// Load open tasks
				HumanTask.getFromCurrentUser({
					p : 0,
					c : 5,
					d : 'rootContainerId'
				}).$promise.then(function (tasks) {
					$scope.tasks = tasks.items;
					$scope.totalTasksToDo = tasks.totalCount;
				});

				// Load archived tasks
				ArchivedHumanTask.getCompletedByCurrentUser({
					p : 0,
					c : 5,
					d : 'rootContainerId'
				}).$promise.then(function (archivedTasks) {
					$scope.archivedTasks = archivedTasks.items;
					$scope.totalArchivedTasks = archivedTasks.totalCount;
				});

				// Load apps
				ProcessDefinition.getStartableByCurrentUser({
					p : 0,
					c : 5,
					d : 'deployedBy'
				}).$promise.then(function (apps) {
					$scope.apps = apps.items;
					$scope.totalAppsAvailable = apps.totalCount;
				});

				// Load cases
				ProcessInstance.getStartedByCurrentUser({
					p : 0,
					c : 5,
					d : 'processDefinitionId'
				}).$promise.then(function (cases) {
					$scope.cases = cases.items;
					$scope.totalCasesOpen = cases.totalCount;
				});

				// Load archived cases
				ArchivedProcessInstance.getStartedByCurrentUser({
					p : 0,
					c : 5,
					d : 'processDefinitionId'
				}).$promise.then(function (archivedCases) {
					$scope.archivedCases = archivedCases.items;
					$scope.totalArchivedCases = archivedCases.totalCount;
				});

				$scope.hover = function (element) {
					$scope.showRest[element] = !$scope.showRest[element];
				};

				$scope.getDate = function (date) {
					return new Date(date).toLocaleString();
				};

				// Modal dialog that displays REST documentation
				$scope.openRestModal = function (url) {
					$modal.open({
						templateUrl : 'directives/modal/' + url,
						controller : [ '$scope', '$modalInstance', function ($scope, $modalInstance) {
							$scope.ok = function () {
								$modalInstance.close();
							};
						} ]
					});
				};

				// Modal dialog that displays an iframe
				$scope.openStartModal = function (id, processName, processVersion, operationType, taskName) {
					var dialog = $modal.open({
						templateUrl : 'directives/modal/start-process.html',
						controller : function ($scope, $modalInstance, $sce, bonitaConfig) {
							$scope.cancel = function () {
								$modalInstance.dismiss('cancel');
							};
							$scope.getUrl = function () {
								var url = bonitaConfig.getBonitaUrl() + '/portal/homepage?ui=form&locale=en&tenant=1#form=' + processName + '--' + processVersion;
								if (operationType === 'startApp') {
									url += '$entry&process=' + id + '&autoInstantiate=false&mode=form';
								} else {
									url += '--' + taskName + '$entry&task=' + id + '&mode=form&assignTask=true';
								}
								url = $sce.trustAsResourceUrl(url);
								return url;
							};
						},
						size : 'lg'
					});
					dialog.result['finally'](function () {
						$scope.quickdetails.teamtasksPagination.refresh = !$scope.quickdetails.teamtasksPagination.refresh;
					});
				};
			});
		});
