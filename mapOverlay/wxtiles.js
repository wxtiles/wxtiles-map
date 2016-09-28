var request = require('superagent')
var _ = require('lodash')
const server = 'https://api.wxtiles.com/v0';


// /<ownerID>/layer/
var getAllLayers = (onSuccess, onError) => {
  request
    .get(`${server}/wxtiles/layer/`)
    .end((err, res) => {
      if (err) return onError(err)
      onSuccess(JSON.parse(res.text))
    })
}

var getInstance = ({layerId, instanceId, onSuccess, onError}) => {
  request
    .get(`${server}/wxtiles/layer/${layerId}/instance/${instanceId}/`)
    .end((err, res) => {
      if (err) return onError(err)
      onSuccess(res.body)
    })
}

// /<ownerID>/layer/<layerID>/<instanceID>/times/
var getTimesForInstance = (options) => {
  request
    .get(`${server}/wxtiles/layer/${options.layerId}/instance/${options.instanceId}/times/`)
    .end((err, res) => {
      if (err) return options.onError(err)
      options.onSuccess(JSON.parse(res.text))
    })
}

// /<ownerID>/layer/<layerID>/<instanceID>/levels/
var getLevelsForInstance = (options) => {
  request
    .get(`${server}/wxtiles/layer/${options.layerId}/instance/${options.instanceId}/levels/`)
    .end((err, res) => {
      if (err) return options.onError(err)
      options.onSuccess(JSON.parse(res.text))
    })
}

// /<ownerID>/tile/<layerID>/<instanceID>/<time>/<level>/<z>/<x>/<y>.<extension>
var getTileLayerUrl = ({layerId, instanceId, time, level, onSuccess, onError}) => {
  level = level || 0
  onSuccess(`${server}/wxtiles/tile/${layerId}/${instanceId}/${time}/${level}/{z}/{x}/{y}.png`)
}

var getAllTileLayerUrls = ({layerId, instanceId, times, level, onSuccess, onError}) => {
  var urls = []
  Promise.all(_.map(times, (time) => {
    return new Promise((resolve, reject) => {
      var scopedSuccess = (url) => {
        resolve({time, url})
      }
      getTileLayerUrl({layerId, instanceId, time, level, onSuccess: scopedSuccess, onError})
    })
  })).then((timeUrls) => {
    onSuccess(timeUrls)
  })
}

// https://api.wxtiles.com/v0/{ownerId}/legend/{layerId}/{instanceId}/{size}/{orientation}.png
var getLegendUrl = ({layerId, instanceId, onSuccess, onError}) => {
  onSuccess(`${server}/wxtiles/legend/${layerId}/${instanceId}/small/horizontal.png`)
}


//Call this with your url and plug the returned object into google maps.
//E.G:
//var mapLayer = wxTiles.google.getImageMapType(layerTilesUrl);
//googleMap.overlayMapTypes.setAt(layerKey, mapLayer);
var googleMaps = {}
googleMaps.getImageMapType = (layerTilesUrl) => {
  return new google.maps.ImageMapType({
    getTileUrl: (coord, zoom) => {
      return layerTilesUrl.replace('{z}', zoom).replace('{x}', coord.x).replace('{y}', (Math.pow(2, zoom) - coord.y - 1));
    },
    tileSize: new google.maps.Size(256, 256),
    isPng: true
  })
}

module.exports = {getAllLayers, getTimesForInstance, getTileLayerUrl, googleMaps, getInstance, getLegendUrl, getAllTileLayerUrls}
