var React = require('react')
var _ = require('lodash')
var reactLeaflet = require('react-leaflet')
var leaflet = require('leaflet')

get_bounds = function (layer) {
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
        leaflet.latLng({lon: -180, lat: 90}),
        leaflet.latLng({lon: 180, lat: -90})
    )
  }
}

class mapWrapper extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
  }

  render() {
    var mapParams = {
      className: 'map',
      center: this.props.center,
      zoom: this.props.zoom
    }
    var layers = this.props.layers
    var tileLayersProps = _.filter(layers, (layer) => layer.isVisible)
    tileLayersProps = _.map(tileLayersProps, (layer) => {
      return _.map(layer.timeUrlsToRender, (timeUrl) => {
        var opacity = 0
        if (timeUrl.isVisible) opacity = layer.opacity
        return {
          zIndex: layer.zIndex,
          opacity: opacity,
          url: timeUrl.url,
          key: layer.zIndex + ' ' + timeUrl.url,
          tms: true,
          bounds: get_bounds(layer)
        }
      })
    })
    tileLayersProps = _.flatten(tileLayersProps)
    return React.createElement('div', {className: 'mapWrapper'},
      React.createElement(reactLeaflet.Map, mapParams,
        _.map(tileLayersProps, (tileLayerProps) => {
          return React.createElement(reactLeaflet.TileLayer, tileLayerProps)
        }),
        React.createElement(reactLeaflet.TileLayer, {
          url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          subdomains: 'abcd',
          zIndex: -1
        })
      )
    )
  }
}

module.exports = mapWrapper
