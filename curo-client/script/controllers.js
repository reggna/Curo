function MainTabs($scope, $location, $log) {
  $scope.tabs = [{title: 'Home',    url: '/client/home'},
                 {title: 'Yearly',  url: '/client/yearly'},
                 {title: 'Monthly', url: '/client/monthly'},
                 {title: 'Add',     url: '/client/add'}];

  $scope.getClass = function($index) {
    var this_url = $scope.tabs[$index].url
    var current_url = $location.path()
    return (this_url == current_url) ? "active": "";
  }
}

function TransactionTableController($scope, Entity) {
    $scope.getEntity = function(eId) {
        eId = eId.substring(0, eId.length - 1)
        eId = eId.substring(eId.lastIndexOf("/") + 1, eId.length);
        $scope.entity = Entity.get({id:eId});
    }
}
