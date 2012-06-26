
angular.module("backend", ['ngResource']).

    config(function() {
        //$log.info("config backend");
    }).

    factory('Transaction', function($resource, $log) {
        var Transaction = $resource('/api/transactions/:id/');
        $log.info(Transaction);

        return Transaction;

    });


