var React = require('react')
var ReactDOM = require('react-dom')
var _ = require('lodash')
var legend = require('./legend')

class legends extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.showLegends = true
    this.showLegends = this.showLegends.bind(this)
    this.hideLegends = this.hideLegends.bind(this)
    this.check = this.check.bind(this)
    this.unCheck = this.unCheck.bind(this)
  }

  componentWillMount() {
  }

  showLegends() {
    this.setState({showLegends: true})
  }

  hideLegends() {
    this.setState({showLegends: false})
  }

  check({layerId, styleId}) {
    var layers = this.props.legends
    _.forEach(layers, (layer) => {
      if ((layer.layerId == layerId) && (layer.styleId == styleId)) {
        layer.isVisible = true
      }
    })
    this.props.updateVisibleLayers({layers})
  }

  unCheck({layerId, styleId}) {
    var layers = this.props.legends
    _.forEach(layers, (layer) => {
      if ((layer.layerId == layerId) && (layer.styleId == styleId)) {
        layer.isVisible = false
      }
    })
    this.props.updateVisibleLayers({layers})
  }

  render() {
    return this.props.legends.length > 0 && React.createElement('div', {className: 'legends'},
      React.createElement('div', {className: 'legends-control'},
        !this.state.showLegends && React.createElement('a', {href: 'javascript:void(0);', onClick: this.showLegends}, 'Show legends'),
        this.state.showLegends && React.createElement('a', {href: 'javascript:void(0);', onClick: this.hideLegends}, 'Hide legends')
      ),
      this.state.showLegends && _.map(this.props.legends, (legendDatums) => {
        return React.createElement('div', {key: [legendDatums.layerId, legendDatums.styleId].join(' ')},
          React.createElement(legend, {
            apikey: legendDatums.apikey,
            layerId: legendDatums.layerId,
            styleId: legendDatums.styleId,
            label: legendDatums.label,
            isChecked: legendDatums.isVisible,
            check: this.check,
            unCheck: this.unCheck,
            description: legendDatums.description,
            style: _.find(legendDatums.styles, (style) => {return style.id == legendDatums.styleId})
          })
        )
      }),
      React.createElement('div', {className: 'wxtilesPlug'},
        React.createElement('span', {}, 'Powered by '),
        React.createElement('a', {href: 'https://wxtiles.com', target: '_blank'}, 'WXTiles.com')
      )
    )
  }
}

module.exports = legends
