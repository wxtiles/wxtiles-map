var React = require('react')
var _ = require('lodash')
var reactLeaflet = require('react-leaflet')
var getBounds = require('./getBounds')

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
      var timeUrlsToRender = undefined
      if (!this.props.isAnimating) {
        timeUrlsToRender = _.filter(layer.timeUrlsToRender, (timeUrl) => timeUrl.isVisible)
      } else {
        timeUrlsToRender = layer.timeUrlsToRender
      }
      return _.map(timeUrlsToRender, (timeUrl) => {
        return {
          zIndex: layer.zIndex,
          opacity: timeUrl.isVisible ? layer.opacity : 0,
          url: timeUrl.url,
          key: layer.zIndex + ' ' + timeUrl.url,
          tms: true,
          bounds: getBounds(layer),
          minZoom: layer.minZoom,
          maxNativeZoom: layer.maxNativeZoom
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
          url: 'https://api.mapbox.com/styles/v1/metocean/civblde3g001c2ipkwfs17qh3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWV0b2NlYW4iLCJhIjoia1hXZjVfSSJ9.rQPq6XLE0VhVPtcD9Cfw6A',
          zIndex: 500
        }),
        React.createElement(reactLeaflet.TileLayer, {
          url: 'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
          subdomains: 'abcd',
          zIndex: 501
        })
      )
    )
  }
}

module.exports = mapWrapper
