var queryString = require('query-string')
var request = require('superagent')
var _ = require('lodash')
var queryStrings = queryString.parse(location.search)
var jsonDatums = JSON.parse(atob(queryStrings.datums))

console.log(jsonDatums)

var setupLeaflet = require('./setupLeaflet')
var leafletInterface = setupLeaflet()

_.forEach(jsonDatums.mapDatums.layers, (layer) => {
  var wxTilesDotCom = 'https://api.wxtiles.com/'
  request
    .get(wxTilesDotCom + 'v0/wxtiles/layer/' + layer.id)
    .end((err, res) => {
      var layer = res.body
      var instances = _.sortBy(layer.instances, (instance) => { return instance.displayName }).reverse()
      var recentestInstance = instances[0]

      request
        .get(wxTilesDotCom + 'v0/wxtiles/layer/' + layer.id + '/instance/' + recentestInstance.id)
        .end((err, res) => {
          var times = res.body.times
          var someRandomTime = times[0]

          var url = layer.resources.tile.replace('<instance>', recentestInstance.id).replace('<time>', someRandomTime)
          console.log(url)
          url = wxTilesDotCom + 'v0/' + url
          leafletInterface.addLayer(url)
        })
    })
})
