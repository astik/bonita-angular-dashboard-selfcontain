'use strict';

angular.module('bonitaDashboardApp', [ 'ngCookies', 'ui.bootstrap', 'ngBonita' ]);

angular.module('bonitaDashboardApp').config(function (bonitaConfigProvider) {
    bonitaConfigProvider.setBonitaUrl('/bonita');
});
