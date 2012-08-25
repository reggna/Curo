
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
    .factory('Resource', ['$http', '$log', function ($http, $log) {

        var call_callback = function (callback, value) {
            if (callback !== undefined) {
                callback(value);
            }
        }

        var ResourceFactory = function (base_url) {

            var Resource = function (data) {
                angular.extend(this, data);
            };

            Resource.query = function (callback) {
                var value = [];

                function internal_query(url, list) {
                    $log.info("query, internal", url, list);
                    $http.get(url)
                        .success(function (data, status, headers, config) {
                            var i = 0;
                            for (i = 0; i < data.objects.length; i++) {
                                list.push(new Resource(data.objects[i]));
                            }
                            if (data.meta.next) {
                                internal_query(data.meta.next, list);
                            } else {
                                $log.info("query, done", list);
                                call_callback(callback, list);
                            }
                        })
                        .error(function (data, status, headers, config) {
                            call_callback(callback, "Failed");
                        });
                }
                internal_query(base_url, value);

                return value;
            };

            Resource.get = function (resource_uri, callback) {
                var value = new Resource();

                $log.info("get", resource_uri, callback);
                $http.get(resource_uri)
                    .success(function (data, status, headers, config) {
                        $log.info("get, success", data, status, config, callback);
                        angular.extend(value, data);
                        call_callback(callback, value);
                    })
                    .error(function (data, status, headers, config) {
                        $log.info("get, failed", data, config);
                        call_callback(callback, "Failed");
                    });

                return value;
            };

            Resource.prototype.save = function (callback) {
                var value  = this;
                var method = this.resource_uri ? "PUT": "POST";
                var url    = this.resource_uri ? this.resource_uri: base_url;
                
                $log.info("save", method, url, value);
                $http({method: method, url: url, data: value})
                    .success(function (data, status, headers, config) {
                        $log.info("save, success", data, status, config);
                        if (status === 201) {
                            Resource.get(headers("Location"),
                                function (newdata) {
                                    angular.extend(value, newdata);
                                    call_callback(callback, value);
                                });
                        } else {
                            $log.info("old, updated");
                            call_callback(callback, value);
                        }
                    })
                    .error(function (data, status, headers, config) {
                        $log.info("save, fail", data, status, config);
                        call_callback(callback, "Failed");
                    });

                return value;
            };

            Resource.prototype.remove = function(callback) {
                $http.delete(this.resource_uri)
                    .success(function (data, status, headers, config) {
                        call_callback(callback, "Ok");
                    })
                    .error(function (data, status, headers, config) {
                        call_callback(callback, "Error");
                    });
            };
            return Resource;
        };
        return ResourceFactory;
    }])
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
    .factory('Entity', ['Resource', function (Resource, $log) {
        return Resource("/api/entity/");
    }])
    .factory('File', ['Resource', function (Resource, $log) {
        return Resource("/api/file/");
    }])
    .factory('Category', ['Resource', function (Resource, $log) {
        return Resource("/api/category/");
    }])
    .factory('CategoryStats', ['Resource', function (Resource, $log) {
        return Resource("/api/categorystats/");
    }]);

