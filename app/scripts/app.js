'use strict';

angular.module('dashboard', [ 'ngCookies', 'ui.bootstrap', 'ngBonita' ]);

angular.module('dashboard').config(function (bonitaConfigProvider) {
    bonitaConfigProvider.setBonitaUrl('/bonita');
});
