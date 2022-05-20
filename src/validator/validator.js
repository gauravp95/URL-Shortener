const isValid = function(value) {
    if(typeof value === 'undefined' || value === 'null') {return false};
    if(typeof value === 'string' && value.trim().length === 0) {return false};
    return true;
};

const isValidRequestBody = function(value) {
    return Object.keys(value).length > 0;
};

const isValidLongURL = function(url) {
    return (/^(http(s)?:\/\/)?(www.)?([a-zA-Z0-9])+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/[^\s]*)?$/gm).test(url);
 }

module.exports = {isValid,isValidRequestBody,isValidLongURL};