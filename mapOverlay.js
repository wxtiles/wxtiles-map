var React = require('react')
var ReactDOM = require('react-dom')
var legends = require('./mapOverlay/legends')
var _ = require('lodash')

class mapOverlay extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.time = null
  }

  componentWillMount() {
  }

  render() {
    var layers = this.props.layers
    layers = _.filter(layers, (layer) => layer != null)

    var legendsDatums = _.map(layers, (layer) => {
      return {
        label: layer.label,
        url: layer.legendUrl,
        layerId: layer.id,
        instanceId: layer.instanceId
      }
    })
    return React.createElement('div', {className: 'mapControls'},
      React.createElement(legends, {legends: legendsDatums})
    )
  }
}

module.exports = mapOverlay
