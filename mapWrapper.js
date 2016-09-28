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
//     this.state = {
//   lat: -2,
//   lng: 160,
//   zoom: 2,
// }
    var mapParams = {
      className: 'map',
      center: [-2, 160],
      zoom: 2
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
