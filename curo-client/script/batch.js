"use strict";

function isDate(value) {
    return (value !== undefined && !isNaN(Date.parse(value)));
}

function isNumber(value) {
    return (value !== undefined && !isNaN(Number(value.replace(',',
                                         '.').replace(' ', ''))));
}

function isEmpty(value) {
    return value === undefined || value === "";
}

function trim(string) {
    return string.replace(/^\s+|\s+$/g, '');
}

function detectColumns(data) {
    var columns = [];
    for (var i = 0; i < data[0].length; i++) {
        var validators = [["empty", 0, isEmpty], ["number", 0, isNumber],
                          ["date", 0, isDate],
                          ["text", 0, function () { return true; }]];
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
    var rows = raw.split("\n");

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

function filterInfo(data, log) {
    var result = [];
    var columns = {};
    
    columns["accounting_date"] = data.columns.indexOf("date");
    columns["transaction_date"] = data.columns.indexOf("date", columns["accounting_date"])
    if (columns["transaction_date"] === -1) {
        columns["transaction_date"] = columns["accounting_date"]
    }
    columns["note"] = data.columns.indexOf("text");
    columns["amount"] = data.columns.indexOf("number");

    for (var i = 0; i < data.data.length; i++) {
        result.push([])
        for (var column in columns) {
            result[i].push(data.data[i][columns[column]])
        }
    }
    return result;
}

function BatchController($scope, $log) {
    $scope.raw = "";
    $scope.parsed = {};

    $scope.update = function () {
        var parsedInfo = parseInfo($scope.raw, $log);
        $scope.parsed = filterInfo(parsedInfo, $log);
    };
}

