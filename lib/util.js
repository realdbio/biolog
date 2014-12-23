/**
 * Created by dd on 11/24/14.
 */

isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

strToId = function(raw) {
    return raw.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "-");
}