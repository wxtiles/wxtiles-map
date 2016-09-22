var React = require('react')
var ReactDOM = require('react-dom')
var mapOverlay = require('./mapOverlay')
var request = require('superagent')
var _ = require('lodash')
var jsongString = atob(window.location.href.split('?datums=')[1])
var jsonDatums = JSON.parse(jsongString)
var wxtilesjs = require('./mapOverlay/wxtiles')

var setupLeaflet = require('./setupLeaflet')
var leafletInterface = setupLeaflet({
  center: jsonDatums.mapDatums.center,
  zoom: jsonDatums.mapDatums.zoom
})

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
          var someRandomTime = times[2]

          var withUrl = (url) => {
            leafletInterface.addLayer({
              url,
              opacity: mapDatumsLayer.opacity,
              zIndex: layer.zIndex
            })

            var layerHandle = _.find(jsonDatums.mapDatums.layers, (findingLayer) => findingLayer.id == layer.id)
            layerHandle.instanceId = recentestInstance.id
            layerHandle.label = layer.meta.name

            var mapOverlayMount = document.querySelector('#mapOverlayMount')
            ReactDOM.render(React.createElement('div', {className: 'mapControlsContainer'},
              React.createElement(mapOverlay, {
                layers: jsonDatums.mapDatums.layers
              })
            ), mapOverlayMount)
          }

          wxtilesjs.getTileLayerUrl({
            layerId: layer.id,
            instanceId: recentestInstance.id,
            time: someRandomTime,
            level: 0,
            onSuccess: withUrl,
            onError: (err) => console.log(err)
          })
        })
    })
})
