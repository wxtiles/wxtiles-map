var request = require('superagent')
var _ = require('lodash')
var jsongString = atob(window.location.href.split('?datums=')[1])
var jsonDatums = JSON.parse(jsongString)

console.log(jsonDatums)

var setupLeaflet = require('./setupLeaflet')
var leafletInterface = setupLeaflet()

_.forEach(jsonDatums.mapDatums.layers, (mapDatumsLayer) => {
  var wxTilesDotCom = 'https://api.wxtiles.com/'
  request
    .get(wxTilesDotCom + 'v0/wxtiles/layer/' + mapDatumsLayer.id)
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
          leafletInterface.addLayer({url, opacity: mapDatumsLayer.opacity})
        })
    })
})
