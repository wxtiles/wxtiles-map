var React = require('react')
var ReactDOM = require('react-dom')
var request = require('superagent')
var _ = require('lodash')
var jsongString = atob(window.location.href.split('?datums=')[1])
var jsonDatums = JSON.parse(jsongString)
var wxtilesjs = require('./mapOverlay/wxtiles')
var root = require('./root')
var wxTilesDotCom = 'https://api.wxtiles.com/'
var moment = require('moment-timezone')
console.log(jsonDatums)
if(!jsonDatums.mapDatums.center) {
  jsonDatums.mapDatums.center = {
    lat: 1, lng: 105
  }
  jsonDatums.mapDatums.zoom = 2
}

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
        layer.description = responseForLayer.meta.description
        layer.bounds = responseForLayer.bounds
        layer.isVisible = true
        request
          .get(wxTilesDotCom + 'v0/wxtiles/layer/' + layer.id + '/instance/' + layer.instanceId)
          .end((err, res) => {
            var times = res.body.times
            var acceptTimeUrls = (timeUrls) => {
              layer.timeUrls = _.map(timeUrls, (timeUrl) => {
                timeUrl.time = moment.utc(timeUrl.time, 'YYYY-MM-DDTHH:mm:ss[Z]')
                return timeUrl
              })
              layer.timeUrls = _.sortBy(layer.timeUrls, (timeUrl) => +timeUrl.time)
              while(layer.timeUrls.length > 50) {
                times = _.remove(times, (time, key) => key % 2 == 0)
                layer.timeUrls = _.remove(layer.timeUrls, (timeUrl, key) => key % 2 == 0)
              }
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
  mapOptions.now = moment.utc()
  ReactDOM.render(React.createElement(root, {mapOptions}), mount)
})
