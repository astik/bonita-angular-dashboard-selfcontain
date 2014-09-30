'use strict';

/**
 * @ngdoc function
 * @name bonitaDashboardApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the bonitaDashboardApp
 */
angular.module('bonitaDashboardApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
