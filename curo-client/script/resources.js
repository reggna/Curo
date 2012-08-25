
/* We redefine query in alla resources since we do not get a list of objects
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

            Resource.query = function (success, error) {
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
                                call_callback(success, list);
                            }
                        })
                        .error(function (data, status, headers, config) {
                            call_callback(error, "Failed");
                        });
                }
                internal_query(base_url, value);

                return value;
            };

            Resource.get = function (resource_uri, success, error) {
                var value = new Resource();

                $log.info("get", resource_uri, success, error);
                $http.get(resource_uri)
                    .success(function (data, status, headers, config) {
                        $log.info("get, success", data, status, config, success);
                        angular.extend(value, data);
                        call_callback(success, value);
                    })
                    .error(function (data, status, headers, config) {
                        $log.info("get, failed", data, config);
                        call_callback(error, "Failed");
                    });

                return value;
            };

            Resource.prototype.save = function (success, error) {
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
                                    call_callback(success, value);
                                });
                        } else {
                            $log.info("old, updated");
                            call_callback(success, value);
                        }
                    })
                    .error(function (data, status, headers, config) {
                        $log.info("save, fail", data, status, config);
                        call_callback(error, "Failed");
                    });

                return value;
            };

            Resource.prototype.remove = function(success, error) {
                $http.delete(this.resource_uri)
                    .success(function (data, status, headers, config) {
                        call_callback(success, "Ok");
                    })
                    .error(function (data, status, headers, config) {
                        call_callback(error, "Error");
                    });
            };
            return Resource;
        };
        return ResourceFactory;
    }])
    .factory('Transaction',
        function($resource, $log) {
            return $resource('/api/transaction/:id', {}, {
                    'query': { method: 'GET', params:{}, isArray:false}
                });
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

