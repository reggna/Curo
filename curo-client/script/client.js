angular.module('Curo', ['CuroResources', 'CuroComponents', 'CuroFilters', 'CuroProviders', 'bootstrap']
    , function($routeProvider, $locationProvider) {

        $routeProvider.when('/client/home', {
            templateUrl: 'partials/home.html',
        });
        $routeProvider.when('/client/yearly', {
            templateUrl: 'partials/yearly.html',
        });
        $routeProvider.when('/client/monthly', {
            templateUrl: 'partials/monthly.html',
        });
        $routeProvider.when('/client/add', {
            templateUrl: 'partials/add.html',
        });
        $routeProvider.when('/client/categories', {
            templateUrl: 'partials/categories.html',
        });
        $routeProvider.otherwise({
            redirectTo: '/client/home'
        });
    
        // configure html5 to get links working on jsfiddle
        $locationProvider.html5Mode(true);
    }
);

