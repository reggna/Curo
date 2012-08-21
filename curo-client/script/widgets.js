
angular.module('CuroComponents', [])
    .directive('ngBlur'
        ,function($log,$parse) {
            return {
            restrict: 'A',
            link:
                function postLink(scope, element, attrs) {
                    if (attrs.ngBlur) {
                        var fn = $parse(attrs.ngBlur);
                        element.bind('blur', function(event) {
                            scope.$apply(function() {
                                fn(scope, {$event:event});
                            });
                        });
                    }
                }
            }
        }
    )
    .directive('monthlyTransactionTable',
        function(Transaction,$log) {
            return {
                restrict: 'EA',
                replace: true,
                scope: { month:'@' },
                templateUrl: '/client/partials/monthly-table.html',
                link: function postLink(scope, iElement, iAttrs) {
                
                    scope.$watch('month', function(newValue, oldValue) {
                        scope.ts = Transaction.query({month:newValue,full:true});
                    });
                },
                controller: ['$scope','Transaction','$log', function($scope, Transaction, $log) {
                    $scope.isEditMode = false;
                    
                    $scope.saveTransaction = function() {
                        if ($scope.newTransaction) {
                            $log.log("About to save!");
                            $scope.newTransaction.$save(function() {
                                $scope.ts = Transaction.query({month:$scope.month,full:true});
                            });                        
                            $scope.isEditMode = false;
                        }
                    };
                    
                    $scope.toggleEditMode = function() {
                        $scope.isEditMode = !$scope.isEditMode;
                        if ($scope.isEditMode) {
                            $scope.newTransaction = new Transaction();
                            $scope.newTransaction.order_date = "2012-08-13";
                            $scope.newTransaction.category = "/api/category/1";
                            $scope.newTransaction.entity = "/api/entity/1";
                        }
                        /*$scope.$watch('newTransaction', 
                            function(transaction) {
                                $scope.foo = transaction.$save();
                                $log.log(transaction);
                            }, true);*/
                    }
                }
                ]
            }
        }
    )
    .directive('monthlyTransactionStats',
        function(CategoryStats, Category, $log) {
            return {
                restrict: 'EA',
                replace: true,
                scope: { month:'@' },
                templateUrl: '/client/partials/monthly-stats.html',
                link: function postLink(scope, iElement, iAttrs) {
                
                    //scope.$watch('month', function(newValue, oldValue) {
                        CategoryStats.query()
                            .then(function(data) {
                                $log.info("got:", data);
                                
                                var result = [];
                                
                                function treeify(list, parent) {
                                    var name = parent == null ? "base": parent.name;
                                    //$log.info("loop", name, list);
                                    var result = [];
                                    for (var i = 0; i < list.length; i++) {
                                        if (list[i].parent === parent.resource_uri) {
                                            //$log.info(i, list[i]);
                                            result.push(list.splice(i, 1)[0]);
                                        }
                                    }
                                    //$log.info("result", result);
                                    var childs = [];
                                    for (var i = 0; i < result.length; i++) {
                                        childs.push(treeify(list, result[i]));
                                    }
                                    //$log.info("parent", parent);
                                    parent.childs = childs;
                                    return parent;
                                }
                                
                                function summ(tree) {
                                    var sum = 0;
                                    if (tree === undefined || tree === null) {
                                        return 0;
                                    }
                                    for (var i = 0; i < tree.length; i++) {
                                        tree[i].amount += summ(tree[i].childs);
                                        sum += tree[i].amount;
                                    }
                                    return sum;
                                }
                                
                                function addall(tree, parentElem, level) {
                                    $log.info("addall", tree, parentElem);
                                    if (tree === undefined || tree === null) {
                                        return;
                                    }
                                    $log.info("tree", tree, tree.length);
                                    for (var i = 0; i < tree.length; i++) {
                                        $log.info("element", tree[i]);
                                        elem = angular.element("<tr style='padding-left: 20px'></tr>");
                                        if (tree[i].childs.length === 0) {
                                            elem.append(angular.element("<td style='padding-left: " + level + "em'>" + tree[i].name + "</td>"));
                                        } else {
                                            elem.append(angular.element("<td style='padding-left: " + level + "em'> + " + tree[i].name + "</td>"));
                                        }
                                        elem.append(angular.element("<td>" + tree[i].amount + "</td>"));
                                        parentElem.append(elem);
                                        addall(tree[i].childs, parentElem, level + 1);
                                    }
                                }
                                
                                categories = treeify(data, {"resource_uri": null}).childs;
                                summ(categories);
                                $log.info("categories", categories);
                                var x = angular.element("<table class='table table-striped'></table>");
                                iElement.append(x);
                                addall(categories, x, 1);
                                scope.test = categories;
                                
                            });
                        
                        $log.info(Category);
                        $log.info(Category.$query);
                        /*scope.test = CategoryStats.query(
                            function(data) {
                                
                            });*/
                    //});
                },
                controller: ['$scope','Transaction','$log', function($scope, Transaction, $log) {
                    //$scope.data = $scope.stats.objects;
                    //$log.info($scope.stat)
                    //$scope.test = CategoryStats.query({full:true});
                }
                ]
            }
        }
    )
    ;
