var queryString = require('query-string')
var queryStrings = queryString.parse(location.search)
var jsonDatums = JSON.parse(atob(queryStrings.datums))
console.log(jsonDatums)
