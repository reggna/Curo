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
    if(typeof parse === 'function')
        this.validate = function(string){return validate(parse(string));};
    else
        this.validate = validate;
}

function stripNumber(string) {
    if(string === undefined) return "";
    string = string.replace(/( :-)+$/g, '').replace(/\s+/g, '');

    // 1,100.0 && 1.100,0, 1.100 ==> 1100.0
    var parts = string.split(/[,.]/g);
    var sum = Number(parts[0]);
    for(var p = 1; p < parts.length; p++){
        var num = parts[p];
        if(p === parts.length-1 && parts[p].length > 2){
            // This is most probably the decimal part
            num = num/Math.pow(10, parts[p].length);
        } else {
            sum *= 1000;
        }
        sum += (sum < 0? -num:num);
    }
    return sum;
}

function detectColumns(data) {
    var columns = [];
    var validators = [ new Validator("empty", isEmpty),
                       new Validator("number", isNumber, stripNumber),
                       new Validator("date", isDate),
                       new Validator("text", function() { return true; }) ];

    // Check each column separately
    for (var i = 0; i < data[0].length; i++) {

        // Use this to count the number of matches for each validator on each cell
        for (var v in validators) validators[v].count = 0;

        // Gather column type information
        for (var j = 0; j < data.length; j++) {
            for (var v = 0; v < validators.length; v++) {
                if(validators[v].validate(data[j][i]))
                    validators[v].count += 1;
            }
        }

        // Decide column type
        for (var v = 0; v < validators.length; v++) {
            if (validators[v].count === data.length) {
                columns.push(validators[v].name);
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

