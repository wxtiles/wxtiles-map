var React = require('react')
var ReactDOM = require('react-dom')
var request = require('superagent')
var _ = require('lodash')
var jsongString = atob(window.location.href.split('?datums=')[1])
var jsonDatums = JSON.parse(jsongString)
var wxtilesjs = require('./mapOverlay/wxtiles')
var root = require('./root')
var wxTilesDotCom = 'https://api.wxtiles.com/'
console.log(jsonDatums)

var layers = []
Promise.all(_.map(jsonDatums.mapDatums.layers, (mapDatumsLayer) => {
  return new Promise((resolve, reject) => {
    var layer = {
      id: mapDatumsLayer.id,
      opacity: mapDatumsLayer.opacity,
      zIndex: mapDatumsLayer.zIndex
    }
    request
      .get(wxTilesDotCom + 'v0/wxtiles/layer/' + mapDatumsLayer.id)
      .end((err, res) => {
        var responseForLayer = res.body
        var instances = _.sortBy(responseForLayer.instances, (instance) => { return instance.displayName }).reverse()
        layer.instanceId = instances[0].id
        layer.label = responseForLayer.meta.name
        request
          .get(wxTilesDotCom + 'v0/wxtiles/layer/' + layer.id + '/instance/' + layer.instanceId)
          .end((err, res) => {
            var times = res.body.times
            var acceptTimeUrls = (timeUrls) => {
              layer.timeUrls = timeUrls
              resolve(layer)
            }

            wxtilesjs.getAllTileLayerUrls({
              layerId: layer.id,
              instanceId: layer.instanceId,
              times,
              level: 0,
              onSuccess: acceptTimeUrls,
              onError: (err) => console.log(err)
            })
          })
      })
  })
})).then((layers) => {
  var mount = document.querySelector('#root')
  var mapOptions = jsonDatums.mapDatums
  mapOptions.layers = layers
  ReactDOM.render(React.createElement(root, {mapOptions}), mount)
})
