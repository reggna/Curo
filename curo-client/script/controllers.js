'use strict';

function MainTabs($scope, $location, $log) {
  $scope.tabs = [
                 {title: 'Home',    url: '/client/home'},
                 {title: 'Yearly',  url: '/client/yearly'},
                 {title: 'Monthly', url: '/client/monthly'},
                 {title: 'Add',     url: '/client/add'},
                 {title: 'Categories', url: '/client/categories'}
                ];

  $scope.getClass = function($index) {
    var this_url = $scope.tabs[$index].url
    var current_url = $location.path()
    return (this_url == current_url) ? "active": "";
  }
}


function CategoryController($scope, $http, Category) {
    Category.get({'limit': 1000}, function(data) {
        $scope.categories = data.objects;
    });
    $scope.update = function() {
        $http.post('/api/category/', this.c);
    };
    $scope.add = function(){
        $http.post('/api/category/', this.category).then(function(result){
            Category.get({"id": result.headers().location.substring(result.headers().location.lastIndexOf("/")+1)},
                    function(data) {
                $scope.category = data;
            });
        });  
    };
    
    $scope.remake = function(){
        alert("hej");
    }
}

function TransactionTableController($log, $scope, Entity,Transaction) {

    $scope.getEntity = function(eId) {
        eId = eId.substring(0, eId.length - 1)
        eId = eId.substring(eId.lastIndexOf("/") + 1, eId.length);
        $scope.entity = Entity.get({id:eId});
    }
}

function MonthsController($scope) {
    $scope.months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','okt','nov','dec'];
    $scope.tabModel = $scope.months[new Date().getMonth()];
}

