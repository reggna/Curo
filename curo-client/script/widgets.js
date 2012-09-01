
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
    });

