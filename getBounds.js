var leaflet = require('leaflet')

getBounds = function (layer) {
  if (layer.bounds.east > layer.bounds.west && (layer.bounds.west - layer.bounds.east) <= 0.5) {
    // Valid
    return leaflet.latLngBounds(
        leaflet.latLng({lon: layer.bounds.east, lat: layer.bounds.north}),
        leaflet.latLng({lon: layer.bounds.west, lat: layer.bounds.south})
    )
  } else {
    // NOTE: hack workaround for layer bounds that are broken for some layers?
    // TODO: remove when GFS and MWW3 layers return valid bounds in prod
    return leaflet.latLngBounds(
        leaflet.latLng({lon: 180, lat: 90}),
        leaflet.latLng({lon: -180, lat: -90})
    )
  }
}

module.exports = getBounds
