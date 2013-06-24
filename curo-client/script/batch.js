(function() {
    "use strict";

    function isDate(value) {
        return (value !== undefined && !isNaN(Date.parse(value)));
    }

    function isNumber(value) {
        return value !== undefined && !isNaN(Number(value));
    }

    function isEmpty(value) {
        return value === undefined || value === "";
    }

    function trim(string) {
        return string.replace(/^\s+|\s+$/g, '');
    }

    function Validator(name, validate, parse) {
        this.name = name;
        this.parse = parse;
        if (typeof parse !== 'function') {
            this.parse = function (string) { return string; };
        }
        this.validate = function (string) {return validate(this.parse(string)); };
    }

    function stripNumber(string) {
        if (string === undefined) {
            return "";
        }
        string = string.replace(/( :-)+$/g, '').replace(/\s+/g, '');

        // 1,100.0 && 1.100,0, 1.100 ==> 1100.0
        var parts = string.split(/[,.]/g);
        var sum = Number(parts[0]);
        var p;
        for (p = 1; p < parts.length; p++) {
            var num = parts[p];
            if (p === parts.length - 1 && parts[p].length <= 2) {
                // This is most probably the decimal part
                num = num / Math.pow(10, parts[p].length);
            } else {
                sum *= 1000;
            }
            sum += (sum < 0 ? -num : num);
        }
        return sum;
    }

    function detectColumns(data, validators) {
        var columns = [];

        // Check each column separately
        var i, v, j;
        for (i = 0; i < data[0].length; i++) {

            // Use this to count the number of matches for each validator on each cell
            for (v in validators) {
                validators[v].count = 0;
            }

            // Gather column type information
            for (j = 0; j < data.length; j++) {
                for (v = 0; v < validators.length; v++) {
                    if (validators[v].validate(data[j][i])) {
                        validators[v].count += 1;
                    }
                }
            }

            // Decide column type
            for (v = 0; v < validators.length; v++) {
                if (validators[v].count === data.length) {
                    columns.push(validators[v]);
                    break;
                }
            }
        }
        return columns;
    }

    function parseInfo($scope, log, categories) {
        var raw = $scope.raw;
        var data = [];
        var rows = raw.split("\n");

        function isCategory(category) {
            return categories.indexOf(category) !== -1;
        }

        var validators = [ new Validator("empty", isEmpty),
                           new Validator("number", isNumber, stripNumber),
                           new Validator("date", isDate),
                           new Validator("category", isCategory),
                           new Validator("text", function () { return true; }) ];

        var columns, i, j;
        for (i = 0; i < rows.length; i++) {
            columns = rows[i].split("\t");
            // Trims values
            for (j = 0; j < columns.length; j++) {
                columns[j] = trim(columns[j]);
            }
            data.push(columns);
        }
        return {columns: detectColumns(data, validators), data: data};
    }

    function filterInfo(data, categoriesNames, categories, log, Transaction) {
        var result = [];
         var row, column, value;

        for (row in data.data) {
            var t = new Transaction();
            for (column in data.columns) {
                value = data.columns[column].parse(data.data[row][column]);
                switch (data.columns[column].name) {
                case "date":
                    t.transaction_date = value;
                    if (t.order_date === undefined) {
                        t.order_date = value;
                    }
                    break;
                case "text":
                    t.note = value;
                    break;
                case "number":
                    t.amount = value;
                    break;
                case "category":
                    t.category_obj = categories[categoriesNames.indexOf(value)];
                    t.category = t.category_obj.resource_uri;
                    break;
                default: //unknown category
                }
            } // for each column
            result.push(t);
        }

        return result;
    }

    function BatchController($scope, $log, Category, Transaction) {
        $scope.raw = "";
        $scope.parsed = {};

        Category.query({}, function (data) {
            var i;
            // Populate an array with only the names of the categories
            $scope.categories = [];
            $scope.categories_obj = [];
            for (i = 0; i < data.objects.length; i++) {
                $scope.categories[i] = data.objects[i].name;
                $scope.categories_obj[i] = data.objects[i];
            }
        }, function(error) {
            $log.info("Failed to get categories");
        });

        $scope.update = function () {
            var parsedInfo = parseInfo($scope, $log, $scope.categories);
            $scope.parsed = filterInfo(parsedInfo, $scope.categories, $scope.categories_obj, $log, Transaction);
            $log.info($scope.parsed);
        };

        $scope.submit = function () {
            var i;
            for (i = 0; i < $scope.parsed.length; i++) {
                delete $scope.parsed[i].category_obj;
                $scope.parsed[i].save();
            }
        };

    }

}());

