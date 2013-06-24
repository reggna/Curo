(function() {
    "use strict";

    window.MainTabs = function MainTabs($scope, $location) {
        $scope.tabs = [{title: 'Home',    url: '/client/home'},
                     {title: 'Yearly',  url: '/client/yearly'},
                     {title: 'Monthly', url: '/client/monthly'},
                     {title: 'Add',     url: '/client/add'}];

        $scope.getClass = function($index) {
            var this_url = $scope.tabs[$index].url,
                current_url = $location.path();
            return (this_url === current_url) ? "active" : "";
        };
    };

    window.MonthsController = function MonthsController($scope, DateService) {
        $scope.months = [DateService.January(), DateService.February(), DateService.March(),
                         DateService.April(), DateService.May(), DateService.June(),
                         DateService.July(), DateService.August(), DateService.September(),
                         DateService.October(), DateService.November(), DateService.December()];
        $scope.tabModel = $scope.months[new Date().getMonth()].name;
    };

    window.MonthController = function MonthController($scope, TransactionSuper, $log) {
        $scope.datagrid = {};
        $scope.datagrid.rows = TransactionSuper.query({interval: $scope.month});
        $scope.datagrid.events = {
            add: function(list) {
                var transaction = TransactionSuper.get(),
                    now = new Date(),
                    month = now.getMonth() + 1;
                month = month >= 10 ? month : "0" + month;
                transaction.order_date = now.getFullYear() + "-" + month + "-" + now.getDate();
                transaction.save(function() {
                    list.push(transaction);
                });
            },
            remove: function(list, index) {
                $log.log("TODO: remove in backend");
                var transaction = list.splice(index, 1)[0];
                $log.log("aa", transaction);
                if (angular.isDefined(transaction)) {
                    transaction.remove();
                }
            },
            save: function(list, index) {
                var transaction = list[index];
                if (angular.isDefined(transaction) && angular.isDefined(transaction.save)) {
                    if (angular.isDefined(transaction.order_date)) {
                        list[index].save();
                    }
                }
            }
        };
    };
    window.MonthController.$inject = ['$scope', 'TransactionSuper', '$log'];
}());

