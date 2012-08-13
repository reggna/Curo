
// TODO create DateUtil thingy
var months = new Array();
months["jan"] = 0;
months["feb"] = 1;
months["mar"] = 2;
months["apr"] = 3;
months["may"] = 4;
months["jun"] = 5;
months["jul"] = 6;
months["aug"] = 7;
months["sep"] = 8;
months["okt"] = 9;
months["nov"] = 10;
months["dec"] = 11;

function getApiDate(d) {
    if (isNaN(d.getTime())) {
        return "";
    }
    return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
}

function getIdFromTastypie(path) {
    if (path && path.indexOf("/") != -1) {
        path = path.substring(0, path.length - 1)
        path = path.substring(path.lastIndexOf("/") + 1, path.length);
        return parseInt(path);
    }
    return NaN;
}

function handleDateParameters(data) {
    if (data) {
        if (data.month) {
            var now = new Date();
            var startDate = new Date(now.getFullYear(),months[data.month],1);
            var endDate = new Date(now.getFullYear(), months[data.month] + 1, 0, 23, 59, 59)
            data.order_date__gte = getApiDate(startDate);
            data.order_date__lte = getApiDate(endDate);
            delete data.month;
        }
        if (data.days) {
            var days = parseInt(data.days);
            if (days != NaN) {
                var now = new Date();
                var startDate = new Date(now.getFullYear(),d.getMonth(),d.getDate()-data.days);
                data.order_date__gte = getApiDate(startDate);
                data.order_date__lte = getApiDate(now);
                delete data.days;
            }
        }
        if (data.startDate) {
            data.order_date__gte = getApiDate(data.startDate);
            delete data.startDate;
        }
        if (data.endDate) {
            data.order_date__gte = getApiDate(data.endDate);
            delete data.endDate;
        }
    }
}

/* We redefine query in all resources since we do not get a list of objects
   but two objects: 'meta' and 'objects' from the server */

angular.module('CuroResources', ['ngResource'])
    .factory('Transaction',
        function($resource, $log, Entity, Category) {
            var res = $resource('/api/transaction/:id/', {}, {
                      'query': { method: 'GET', params:{}, isArray:false }
                });
                
            var orig_query = res.query
            res.query = function(data, success, error) {
                handleDateParameters(data);
                
                if (data && data.full) {
                    return orig_query(data, function(res_data) {
                        if (res_data && res_data.objects) {
                            for (var i = 0; i < res_data.objects.length; i++) {
                                var r = res_data.objects[i];
                                if (r.entity) {
                                    var entityId = getIdFromTastypie(r.entity)
                                    r.entity = Entity.get({id:entityId});
                                }
                                if (r.category) {
                                    var categoryId = getIdFromTastypie(r.category)
                                    r.category = Category.get({id:categoryId});
                                }
                            }
                        }
                    }, error);
                }
                else {
                    return orig_query(data, success, error);
                }
            };
                
            return res;
        }
    )
    .factory('Entity',
        function($resource, $log) {
            return $resource('/api/entity/:id', {}, {
                    'query': { method: 'GET', params:{}, isArray:false}
                });
        }
    )
    .factory('File',
        function($resource, $log) {
            return $resource('/api/file/:id/', {}, {
                    'query': { method: 'GET', params:{}, isArray:false}
                });
        }
    )
    .factory('Category',
        function($resource, $log) {
            return $resource('/api/category/:id/', {}, {
                    'query': { method: 'GET', params:{}, isArray:false}
                });
        }
    );

