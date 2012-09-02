'use strict';

function MainTabs($scope, $location, $log) {
    $scope.tabs = [
        {title: 'Home',    url: '/client/home'},
        {title: 'Yearly',  url: '/client/yearly'},
        {title: 'Monthly', url: '/client/monthly'},
        {title: 'Add',     url: '/client/add'},
        {title: 'Categories', url: '/client/categories'}
    ];

    $scope.getClass = function ($index) {
        var this_url = $scope.tabs[$index].url;
        var current_url = $location.path();
        return (this_url === current_url) ? "active" : "";
    };
}

function CategoryController($scope, $http, Category) {
    $scope.categories = Category.query();
    $scope.category = new Category();
}

function TransactionTableController($log, $scope, Entity) {

    $scope.getEntity = function(t) {
        var e = t.entity;
        Entity.get(e, function(data) {
            delete t.entity;
            t.entity = data;
        });
    }
}

function MonthsController($scope,DateService) {
    $scope.months = [DateService.January(), DateService.February(), DateService.March()
                    ,DateService.April(),DateService.May(),DateService.June()
                    ,DateService.July(),DateService.August(),DateService.September()
                    ,DateService.October(),DateService.November(),DateService.December()];
    $scope.tabModel = $scope.months[new Date().getMonth()].name;
}


function YearController($scope, DateService) {
    var year = new Date().getFullYear();
    var interval = DateService.dateInterval(new Date(year, 0, 1), new Date(year + 1, 0, 0));
    $scope.interval = interval;
}
