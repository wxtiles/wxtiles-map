var React = require('react')
var ReactDOM = require('react-dom')
var request = require('superagent')
var _ = require('lodash')
var jsongString = atob(window.location.href.split('?datums=')[1])
var jsonDatums = JSON.parse(jsongString)
var wxtilesjs = require('./mapOverlay/wxtiles')
var root = require('./root')
var wxTilesDotCom = 'https://api.wxtiles.com/'
// var wxTilesDotCom = 'http://172.16.1.15/'
var moment = require('moment-timezone')
console.log(jsonDatums)
if(!jsonDatums.mapDatums.center) {
  jsonDatums.mapDatums.center = {
    lat: 1, lng: 105
  }
  jsonDatums.mapDatums.zoom = 2
}

function degradeArray(array, options) {
  _.defaults(options, {fromLeftSide: false, maxLength: 30, retainEnds: true})
  var offset = 2
  var start = options.retainEnds ? array[0] : undefined
  var end = options.retainEnds ? array[array.length - 1] : undefined
  var maxLength = options.retainEnds ? options.maxLength - 2 : options.maxLength
  var retArray = options.retainEnds ? array.slice(1,-1) : array
  var i = null
  while(retArray.length > maxLength) {
    i = !options.fromLeftSide ? array.length - offset : offset - 1
    if (array[i] != undefined) {
      retArray = _.without(retArray, array[i])
      offset += 2
    } else {
      return degradeArray(retArray, options)
    }
  }
  return options.retainEnds ? [start].concat(retArray, [end]) : retArray
}

var layers = []
Promise.all(_.map(jsonDatums.mapDatums.layers, (mapDatumsLayer) => {
  return new Promise((resolve, reject) => {
    var layer = {
      id: mapDatumsLayer.id,
      opacity: mapDatumsLayer.opacity,
      zIndex: mapDatumsLayer.zIndex,
      apikey: jsonDatums.apiKey
    }
    request
      .get(wxTilesDotCom + 'v0/wxtiles/layer/' + mapDatumsLayer.id)
      // .set('apikey', jsonDatums.apiKey) // Set API key
      .end((err, res) => {
        var responseForLayer = res.body
        var instances = _.sortBy(responseForLayer.instances, (instance) => { return instance.displayName }).reverse()
        layer.instanceId = instances[0].id
        layer.label = responseForLayer.meta.name
        layer.description = responseForLayer.meta.description
        layer.bounds = responseForLayer.bounds
        layer.isVisible = true
        layer.instanceType = responseForLayer.instanceType
        request
          .get(wxTilesDotCom + 'v0/wxtiles/layer/' + layer.id + '/instance/' + layer.instanceId)
          // .set('apikey', layer.apiKey) // Set API key
          .end((err, res) => {
            var times = res.body.times
            var acceptTimeUrls = (timeUrls) => {
              layer.timeUrls = _.map(timeUrls, (timeUrl) => {
                timeUrl.time = moment.utc(timeUrl.time, 'YYYY-MM-DDTHH:mm:ss[Z]')
                return timeUrl
              })
              layer.timeUrls = _.sortBy(layer.timeUrls, (timeUrl) => +timeUrl.time)
              layer.timeUrls = degradeArray(layer.timeUrls, {
                fromLeftSide: layer.instanceType != 'observational' ? false : true
              })
              resolve(layer)
            }

            wxtilesjs.getAllTileLayerUrls({
              layerId: layer.id,
              instanceId: layer.instanceId,
              times,
              level: 0,
              apikey: layer.apikey,
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
