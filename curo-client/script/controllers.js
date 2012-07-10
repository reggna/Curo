
function TransactionTableController($scope, Entity) {
    $scope.getEntity = function(eId) {
        eId = eId.substring(0, eId.length - 1)
        eId = eId.substring(eId.lastIndexOf("/") + 1, eId.length);
        $scope.entity = Entity.get({id:eId});
    }
}
