
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
    ;
