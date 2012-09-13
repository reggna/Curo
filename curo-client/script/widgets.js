
angular.module('CuroComponents', [])
    .directive('ngBlur', function ($parse) {
        return {
            restrict: 'A',
            link:
                function postLink(scope, element, attrs) {
                    if (attrs.ngBlur) {
                        var fn = $parse(attrs.ngBlur);
                        element.bind('blur', function (event) {
                            scope.$apply(function () {
                                fn(scope, {$event: event});
                            });
                        });
                    }
                }
        };
    })
    .directive('monthlyTransactionTable',
        function(Transaction,$log) {
            return {
                restrict: 'EA',
                replace: true,
                scope: { month:'=' },
                templateUrl: '/client/partials/monthly-table.html',
                link: function postLink(scope, iElement, iAttrs) {
                    // Result is set in callback to enable loading message
                    Transaction.query({interval:scope.month}, function(data) {
                        scope.ts = data;
                    });
                },
                controller: ['$scope','Transaction','Entity','Category','$log',
                 function($scope, Transaction, Entity, Category, $log) {
                    $scope.getEntity = function(t) {
                        var e = t.entity;
                        Entity.get(e, function(data) {
                            delete t.entity;
                            t.entity = data;
                        });
                    }
                    $scope.getCategory = function(transaction) {
                        var getCategoryRecursive = function(category) {
                            return Category.get(category, function(data) {
                                if (data && data.parent) {
                                    data.parent = getCategoryRecursive(data.parent);
                                } else {
                                    $scope.doneLoadingCategory = true;
                                }
                            });
                        };
                        transaction.category = getCategoryRecursive(transaction.category);
                    }
                    $scope.getFullCategoryName = function(category) {
                        if (!$scope.doneLoadingCategory) return "Loading...";
                    
                        var name = "";
                        var saftlyCounter = 0;
                        for (var cat = category; cat != null && saftlyCounter < 10; (cat = cat.parent ? cat.parent : null), saftlyCounter++) {
                            if (cat && cat.name) {
                                name = cat.name + "." + name;
                            } else {
                                name = "??." + name;
                            }
                        }
                        // Remove dot at end of string
                        if (name.length > 0) {
                            name = name.slice(0,-1);
                        }
                        return name;
                    };
                }
                ]
            }
        }
    )
    .directive('currency', function($log) {
        return {
                restrict: 'C',
                link: function postLink(scope, iElement, iAttrs) {
                
                    var prefix,suffix,decimals;
                    if (iAttrs.currencyPrefix) {
                        prefix = iAttrs.currencyPrefix;
                    }
                    if (iAttrs.currencySuffix) {
                        suffix = iAttrs.currencySuffix;
                    }
                    if (iAttrs.currencyDecimals) {
                        decimals = iAttrs.currencyDecimals;
                    }
                
                    scope.$watch(function() {return iElement.text();}, function(oldValue, newValue) {
                        newValueNumber = parseInt(newValue);
                        if (newValueNumber == NaN) {
                            $log.info("Tried to pass non-number to curo's currency directive. Input: " + newValue);
                            return ;
                        }
                        var isPos = newValueNumber >= 0 ? true : false;
                    
                        if (decimals) {
                            $log.log("Setting deciamls " + decimals);
                            iElement.text(newValueNumber.toFixed(decimals));
                        }
                    
                        if (!isPos && iElement.hasClass("amount-positive")) {
                            iElement.removeClass("amount-positive");
                        }
                        if (isPos && iElement.hasClass("amount-negative")) {
                            iElement.removeClass("amount-negative");
                        }
                        if (isPos) {
                            iElement.addClass("amount-positive");
                        } else {
                            iElement.addClass("amount-negative");
                        }
                    });
                }
            }
    })
    ;

