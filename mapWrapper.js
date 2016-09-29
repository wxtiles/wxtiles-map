var React = require('react')
var _ = require('lodash')
var reactLeaflet = require('react-leaflet')

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
          tms: true
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
          subdomains: 'abcd'
        })
      )
    )
  }
}

module.exports = mapWrapper
