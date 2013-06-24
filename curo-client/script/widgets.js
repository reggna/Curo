(function() {
    "use strict";

    angular.module('CuroComponents', [])
        .directive('ngBlur', function ($parse) {
            return {
                restrict: 'A',
                link:
                    function postLink(scope, element, attrs) {
                        if (attrs.ngBlur) {
                            var fn = $parse(attrs.ngBlur);
                            element.bind('blur', function (event) {
                                scope.$apply(function () {
                                    fn(scope, {$event: event});
                                });
                            });
                        }
                    }
            };
        })
        .directive('currency',
            function($log) {
                return {
                    restrict: 'C',
                    link: function postLink(scope, iElement, iAttrs) {
                        var prefix, suffix, decimals;
                        if (iAttrs.currencyPrefix) {
                            prefix = iAttrs.currencyPrefix;
                        }
                        if (iAttrs.currencySuffix) {
                            suffix = iAttrs.currencySuffix;
                        }
                        if (iAttrs.currencyDecimals) {
                            decimals = iAttrs.currencyDecimals;
                        }

                        scope.$watch(
                            function() {return iElement.text(); },
                            function(oldValue, newValue) {
                                var newValueNumber = parseInt(newValue, 10);
                                if (isNaN(newValueNumber)) {
                                    $log.info("Tried to pass non-number to curo's currency directive. Input: " + newValue);
                                    return;
                                }
                                var isPos = newValueNumber >= 0 ? true : false;

                                if (decimals) {
                                    $log.log("Setting deciamls " + decimals);
                                    iElement.text(newValueNumber.toFixed(decimals));
                                }

                                if (!isPos && iElement.hasClass("amount-positive")) {
                                    iElement.removeClass("amount-positive");
                                }
                                if (isPos && iElement.hasClass("amount-negative")) {
                                    iElement.removeClass("amount-negative");
                                }
                                if (isPos) {
                                    iElement.addClass("amount-positive");
                                } else {
                                    iElement.addClass("amount-negative");
                                }
                            }
                        );
                    }
                };
            })
        .directive('datagrid', function($rootScope, $compile) {
            return {
                restrict: 'A',
                transclude: true,
                scope: {
                    rows: '=datagridRows',
                    events: '=datagridEvents'
                },
                controller:  function($scope, $element, $attrs) {
                    var addRow = function(list) {
                        list.push({});
                    };
                    var removeRow = function(list, index) {
                        return list.splice(index, 1)[0];
                    };
                    var saveRow = function(list, index) {
                    };
                    if (angular.isDefined($scope.events)) {
                        if (angular.isDefined($scope.events.add)) {
                            addRow = $scope.events.add;
                        }
                        if (angular.isDefined($scope.events.remove)) {
                            removeRow = $scope.events.remove;
                        }
                        if (angular.isDefined($scope.events.save)) {
                            saveRow = $scope.events.save;
                        }
                    }

                    // Public functions
                    $scope.toggleEdit = function() {
                        $scope.editMode = !$scope.editMode;
                    };

                    $scope.deleteRow = function(index) {
                        var row = removeRow($scope.rows, index);
                    };

                    $scope.addRow = function() {
                        addRow($scope.rows);
                    };

                    $scope.$on("datagrid:valueChange", function(event, args) {
                        saveRow($scope.rows, args.rowId);
                    });

                    // Init
                    $scope.editMode = false;
                    //addRow();
                },
                compile: function(tElm, tAttrs, transcludeFn) {
                    return {
                        pre: function(scope, elm, attrs) {
                            if (transcludeFn) {
                                transcludeFn(scope, function(clone) {
                                    var columns = [];

                                    clone = clone.filter('tbody');
                                    var controlsTD = '<td><button class="btn btn-danger" ng-hide="!editMode" ng-click="deleteRow($index)">Delete</button></td>';
                                    var trs = clone.children('tr');

                                    var rowTemplate = trs.filter('.datagridRowTemplate');
                                    angular.forEach(rowTemplate.children(), function(templateTD) {
                                        templateTD = angular.element(templateTD);
                                        var name = templateTD.attr('data-datagrid-name');
                                        templateTD.attr('data-ng-model', 'row.' + name);
                                        templateTD.attr('cell-contenteditable', '');
                                        templateTD.removeAttr('data-datagrid-name');

                                        columns.push(name);
                                    });
                                    rowTemplate.append(controlsTD);
                                    rowTemplate.attr('data-ng-repeat', 'row in rows');

                                    var headerRow = trs.filter('.datagridHeaderRow');
                                    if (headerRow.length > 0) {
                                        var controlsHeader = '<th><button class="btn btn-info" ng-click="toggleEdit()">Toggle edit mode</button></th>';
                                        headerRow.append(controlsHeader);
                                    }

                                    var result = '';
                                    angular.forEach(trs, function(tr) {
                                        result += tr.outerHTML;
                                    });
                                    result = '<tbody>' + result + '</tbody>';
                                    var footer = '<tfoot ng-hide="!editMode"><tr><td colspan="4"></td><td><button class="btn btn-success" ng-click="addRow()">Add</button></td></tr></tfoot>';
                                    result += footer;
                                    scope.columns = columns;
                                    console.log("Columns", columns);
                                    elm.append($compile(result)(scope));
                                });
                            }
                        },
                        post: function(scope, elm, attrs) {
                        }
                    };
                },
                link: function(scope, element, attrs) {
                    //console.log("link", scope.columns);
                }
            };
        })
        .directive('cellContenteditable', function($parse) {
            return {
                require: 'ngModel',
                link: function postLink(scope, elm, attrs, ctrl) {
                    elm.bind('keypress', function(event) {
                        if (event.which === 13) { // Enter-key
                            elm.blur();
                            event.preventDefault();
                        }
                        scope.$apply(function() {
                            ctrl.$setViewValue(elm.text());
                        });
                        scope.$emit('datagrid:valueChange', {cellValue: ctrl.$viewValue, rowId: scope.$index});
                    });

                    ctrl.$render = function() {
                        if (ctrl.$viewValue) {
                            elm.text(ctrl.$viewValue);
                        }
                    };

                    var rawElm = elm[0];
                    if (scope.editMode) {
                        rawElm.contentEditable = true;
                    }
                    scope.$watch('editMode', function(newValue) {
                        if (angular.isDefined(newValue)) {
                            rawElm.contentEditable = newValue;
                        }
                    });

                    if (attrs.cellFormatter) {
                        var formatterFunctionFactory = $parse(attrs.cellFormatter)(scope);
                        if (formatterFunctionFactory) {
                            ctrl.$formatters.push(formatterFunctionFactory(scope, elm));
                        }
                    }
                }
            };
        });

}());

