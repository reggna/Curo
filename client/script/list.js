function test($scope, $http, $log) {
  $scope.transactions = []
  $http({method: 'GET', url: '/api/transaction/'}).
  success(function(data, status, headers, config) {
    $scope.transactions = data.objects
  });
}

