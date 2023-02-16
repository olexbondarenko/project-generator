function toCamelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return "";
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

function toKebablCase(str) {
  return str.split(' ').map((word) => {
    return word.toLowerCase();
  }).join('-')
}

function upperCaseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {toCamelCase, toKebablCase, upperCaseFirstLetter}