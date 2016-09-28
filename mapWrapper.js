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
    console.log(this.props)
    var mapParams = {
      className: 'map',
      center: this.props.center,
      zoom: this.props.zoom
    }
    return React.createElement('div', {className: 'mapWrapper'},
      React.createElement(reactLeaflet.Map, mapParams,
        React.createElement(reactLeaflet.TileLayer, {
          url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          subdomains: 'abcd'
        })
      )
    )
  }
}

module.exports = mapWrapper
