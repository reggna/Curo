angular.module('CuroProviders', [])
    .factory('DateService'
        , function($filter, $log) {

            var defaultDateFormat = "yyyy-MM-dd";
            this.setDefaultDateFormat = function(format) {
                defaultDateFormat = format;
            };

            var DateInterval = function(sd,ed,n) {
                if (!angular.isDate(ed)) {
                    if (angular.isDate(sd)) {
                        this.startDate = sd;
                        this.endDate = new Date();
                        if (ed) {
                            this.name = ed;
                        }
                    } else {
                        $log.warn("Tried to create DateInterval with invalid parameters. param: ", sd);
                    }
                } else {
                    if (angular.isDate(sd) && angular.isDate(ed)) {
                        this.endDate = ed;
                        this.startDate = sd;
                        if (n) {
                            this.name = n;
                        }
                    } else {
                        $log.warn("Tried to create DateInterval with invalid parameters. params: ", sd, ed);
                    }
                }
                
                this.startDateAsString = function(format) {
                    if (!format) {
                        format = defaultDateFormat;
                    }
                    return $filter('date')(this.startDate, format);
                }
                this.endDateAsString = function(format) {
                    if (!format) {
                        format = defaultDateFormat;
                    }
                    return $filter('date')(this.endDate, format);
                }
            };

            var DateService = function() {
                function getMonth(year, id) {
                    if (!year) {
                        year = new Date().getFullYear();
                    }
                    var sd = new Date(year,id,1);
                    return new DateInterval( sd  // startDate
                                           , new Date(year,id + 1,0,23,59,59) // endDate
                                           , $filter('date')(sd, "MMMM"));
                }

                this.January = function(year) {return getMonth(year, 0);}
                this.February = function(year) {return getMonth(year, 1);}
                this.March = function(year) {return getMonth(year, 2);}
                this.April = function(year) {return getMonth(year, 3);}
                this.May = function(year) {return getMonth(year, 4);}
                this.June = function(year) {return getMonth(year, 5);}
                this.July = function(year) {return getMonth(year, 6);}
                this.August = function(year) {return getMonth(year, 7);}
                this.September = function(year) {return getMonth(year, 8);}
                this.October = function(year) {return getMonth(year, 9);}
                this.November = function(year) {return getMonth(year, 10);}
                this.December = function(year) {return getMonth(year, 11);}
                
                this.dateInterval = function(sd,ed,n) {
                    return new DateInterval(sd,ed,n);
                }
                
                this.daysInterval = function(days,n) {
                    days = parseInt(days);
                    if (!isNaN(days)) {
                        var now = new Date();
                        var startDate = new Date(now.getFullYear(),d.getMonth(),d.getDate()-data.days);
                        return new DateInterval(startDate,n);
                    } else {
                        $log.warn("Invalid parameter in daysInterval.", days);
                        // Returns dummy interval to allow friendly failing
                        return new DateInterval(new Date(),n);
                    }
                }
            }

            return new DateService();
        }
    )
    .filter('dateIntervalName'
        , function($log) {
            return function(input) {
                if (input && input.name) {
                    return input.name;
                } else {
                    return "";
                }
            }
        }
    )
    ;
