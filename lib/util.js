/**
 * Created by dd on 11/24/14.
 */

isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

strToId = function(raw) {
    return raw.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "-");
};

setValuePath = function(object, path, value) {
    var a = path.split('.');
    var o = object;
    for (var i = 0; i < a.length - 1; i++) {
        var n = a[i];
        if (n in o) {
            o = o[n];
        } else {
            o[n] = {};
            o = o[n];
        }
    }
    o[a[a.length - 1]] = value;
};

getValuePath = function(object, path) {
    var o = object;
    path = path.replace(/\[(\w+)\]/g, '.$1');
    path = path.replace(/^\./, '');
    var a = path.split('.');
    while (a.length) {
        var n = a.shift();
        if (n in o) {
            o = o[n];
        } else {
            return;
        }
    }
    return o;
};