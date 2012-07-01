angular.module('Curo', ['CuroResources', 'CuroComponents', 'CuroFilters']
    , function($routeProvider, $locationProvider) {
        // configure html5 to get links working on jsfiddle
        $locationProvider.html5Mode(true);
    }
);

