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

function CategoryController($scope, Category, Resource) {
    $scope.categories = Category.query({limit:1000});
    $scope.update = function() {
        this.c.save()
    };
    $scope.add = function() {
        var cat = new Category(this.c);
        cat.save(function() {
            /* HERE BE DRAGONS: The controller shouldn't access the DOM directly. */
            document.getElementById("add").value = "";
            var elements = document.getElementsByClassName("categories");
            var element = elements[elements.length-1];
            element.focus();
            element.setSelectionRange(1, 1);
        });
        $scope.categories.push(cat);
    };
    $scope.remove = function() {
      this.c.remove();
      this.c.isHidden = true;
    };
}

