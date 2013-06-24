(function() {
    "use strict";

    angular.module('CuroFilters', ['CuroResources'])
        .factory('CellFormatters', ['Category', function(Category) {
            var currencyFormatter = function(scope, element, attributes) {
                var formatterFn = function(value) {
                    var newValueNumber = parseInt(value, 10);
                    if (isNaN(newValueNumber)) {
                        return value;
                    }
                    var isPositive = newValueNumber >= 0 ? true : false;

                    if (!isPositive && element.hasClass("amount-positive")) {
                        element.removeClass("amount-positive");
                    }
                    if (isPositive && element.hasClass("amount-negative")) {
                        element.removeClass("amount-negative");
                    }
                    if (isPositive) {
                        element.addClass("amount-positive");
                    } else {
                        element.addClass("amount-negative");
                    }
                    return value;
                };
                return formatterFn;
            };
            var categoryFormatter = function(scope, element, attributes) {
                var formatterFn = function(value) {
                    return value; // TODO
                    //console.log("result name", value);
                    if (!value || !value.name) {
                        return '';
                    }

                    var result = value.name;
                    //console.log("result pre", result);
                    while (value.parent !== null) {
                        value = value.parent;
                        result += value.name + '.';
                    }

                    return value;
                };
                return formatterFn;
            };

            return function(formatterName) {
                if (formatterName === 'currency') {
                    console.log("currency called");
                    return currencyFormatter;
                } else if (formatterName === 'category') {
                    console.log("category called");
                    return categoryFormatter;
                }
            };
        }]);
}());

