
/* We redefine query in alla resources since we do not get a list of objects
   but two objects: 'meta' and 'objects' from the server */

angular.module('CuroResources', ['ngResource'])
    .factory('Transaction', 
        function($resource, $log) {
            return $resource('/api/transaction/:id', {}, {
                    'query': { method: 'GET', params:{}, isArray:false}
                });
        }
    )
    .factory('Entity', 
        function($resource, $log) {
            return $resource('/api/entity/:id/', {}, {
                    'query': { method: 'GET', params:{}, isArray:false}
                });
        }
    )
    .factory('File', 
        function($resource, $log) {
            return $resource('/api/file/:id', {}, {
                    'query': { method: 'GET', params:{}, isArray:false}
                });
        }
    )
    .factory('Category', 
        function($resource, $log) {
            return $resource('/api/category/:id', {}, {
                    'query': { method: 'GET', params:{}, isArray:false}
                });
        }
    )
    ;
    
