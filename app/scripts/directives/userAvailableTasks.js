'use strict';

angular.module('bonitaDashboardApp').directive('userAvailableTasks', function ($modal, HumanTask) {
	return {
		restrict : 'E',
		templateUrl : 'views/directives/user-available-tasks.html',
		scope : {},
		link : function (scope) {
			// Load open tasks
			HumanTask.getFromCurrentUser({
				p : 0,
				c : 5,
				d : 'rootContainerId'
			}).$promise.then(function (tasks) {
				scope.tasks = tasks.items;
			});

			// Modal dialog that displays an iframe
			scope.openStartModal = function (id, processName, processVersion, operationType, taskName) {
				var dialog = $modal.open({
					templateUrl : 'views/directives/modal/start-process.html',
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
					// FIXME what is this for ?
					scope.quickdetails.teamtasksPagination.refresh = !scope.quickdetails.teamtasksPagination.refresh;
				});
			};

			scope.getDate = function (date) {
				return new Date(date).toLocaleString();
			};
		}
	};
});
