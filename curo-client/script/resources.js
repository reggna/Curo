angular.module('CuroResources', ['ngResource'])
    .factory('Resource', ['$http', '$log', function ($http, $log) {

        var call_callback = function (callback, value) {
            if (callback !== undefined) {
                callback(value);
            }
        }

        var translate_convenience_params = function() {
            function handle_param_interval(params,param,field) {
                var dateInterval = params[param];
                if (dateInterval) {
                    params[field + "__gte"] = dateInterval.startDateAsString();
                    params[field + "__lte"] = dateInterval.endDateAsString();
                }
                delete params[param];
            }
        
            var intervalPattern = /^interval(?:__(.+))?$/;
            return function (params) {
                var match;
                for (param in params) {
                    if ((match = param.match(intervalPattern)) != null) {
                        
                        var field = match[1];
                        if (!field) {
                            field = "order_date";
                        }
                        handle_param_interval(params,param,field);
                    }
                }
            }
        }();
        
        function build_url(base, params) {
            if (!params || params === {}) {
                return base;
            } else {
                translate_convenience_params(params);
                
                var ps = Array();
                for (param in params) {
                    ps.push(param + "=" + params[param]);
                }
                return base + "?" + ps.join("&");
            }
        }

        var ResourceFactory = function (base_url) {

            var Resource = function (data) {
                angular.extend(this, data);
                
            };

            Resource.query = function (params, success, error) {
                if (angular.isFunction(params)) {
                    callback = params;
                    params = {};
                }
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
                internal_query(build_url(base_url, params), value);

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
    .factory('Transaction', ['Resource', function (Resource, $log) {
        return Resource("/api/transaction/");
    }])
    .factory('Entity', ['Resource', function (Resource, $log) {
        return Resource("/api/entity/");
    }])
    .factory('File', ['Resource', function (Resource, $log) {
        return Resource("/api/file/");
    }])
    .factory('Category', ['Resource', function (Resource, $log) {
        return Resource("/api/category/");
    }])
    .factory('Statistics', ['Resource', function (Resource, $log) {
        return Resource("/api/statistics/");
    }])
    ;

