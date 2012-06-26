angular.module('curo', ['bootstrap', 'backend'], function($routeProvider, $locationProvider) {
  $routeProvider.when('/client/home', {
    templateUrl: 'partials/home.html',
  });
  $routeProvider.when('/client/list', {
    templateUrl: 'partials/list.html',
  });
  $routeProvider.when('/client/batch', {
    templateUrl: 'partials/batch.html',
  });
  $routeProvider.otherwise({
    redirectTo: '/client/home'
  });
 
  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
});

/*function main($scope, $route, $routeParams, $location) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
}*/

function MainTabs($scope) {
  $scope.tabs = [{title: 'Home',      url: '/client/home'},
                 {title: 'List',      url: '/client/list'},
                 {title: 'Batch add', url: '/client/batch'}];
  $scope.index = 0;

  $scope.getClass = function($index) {
    return ($index == $scope.index) ? "active": "";
  }
  
  $scope.setActive = function($index) {
    $scope.index = $index;
  }

}
