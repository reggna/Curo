
angular.module('CuroComponents', [])
    .directive('monthlyTransactionList', 
        function() {
            return {
                restrict: 'EA',
                replace: true,
                scope: {  },
                templateUrl: '/client/partials/monthly.html'
            }
        }
    )
    .directive('monthlyTransactionTable', 
        function(Transaction) {
            return {
                restrict: 'EA',
                replace: true,
                scope: { month:'@' },
                templateUrl: '/client/partials/monthly-table.html',
                link: function postLink(scope, iElement, iAttrs) { 
                    scope.ts = Transaction.query();
                }
            }
        }
    )
    ;
