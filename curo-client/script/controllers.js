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

function MonthsController($scope,DateService) {
    $scope.months = [DateService.January(), DateService.February(), DateService.March()
                    ,DateService.April(),DateService.May(),DateService.June()
                    ,DateService.July(),DateService.August(),DateService.September()
                    ,DateService.October(),DateService.November(),DateService.December()];
    $scope.tabModel = $scope.months[new Date().getMonth()].name;
}

