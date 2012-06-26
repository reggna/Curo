"use strict";

function isDate(value) {
    return (value != undefined && !isNaN(Date.parse(value)));
}

function isNumber(value) {
    return (value != undefined && !isNaN(Number(value.replace(',',
                                         '.').replace(' ', ''))));
}

function isEmpty(value) {
    return value == undefined || value == "";
}

function trim(string) {
    return string.replace(/^\s+|\s+$/g, '');
}

function detectColumns(data) {
    var columns = [];
    for (var i = 0; i < data[0].length; i++) {
        var validators = [["empty", 0, isEmpty], ["date", 0, isDate],
                          ["number", 0, isNumber],
                          ["text", 0, function() { return true; }]];
        // Gather column type information
        for (var j = 0; j < data.length; j++) {
            for (var v = 0; v < validators.length; v++) {
                validators[v][1] += validators[v][2](data[j][i]) ? 1: 0;
            }
        }
        // Decide column type
        for (var v = 0; v < validators.length; v++) {
            if (validators[v][1] == data.length) {
                columns.push(validators[v][0]);
                break;
            }
        }
    }
    return columns;
}

function parseInfo(raw, log) {
    var data = [];
    var rows = trim(raw).split("\n");

    for (var i = 0; i < rows.length; i++) {
        var columns = rows[i].split("\t");
        // Trims values
        for (var j = 0; j < columns.length; j++) {
            columns[j] = trim(columns[j]);
        }
        data.push(columns);
    }
    return {columns: detectColumns(data), data: data};
}

function BatchController($scope, $log) {
  $scope.raw = "";
  $scope.parsed = "";
  
  $scope.update = function() {
    $scope.parsed = parseInfo($scope.raw, $log);
  };
}

