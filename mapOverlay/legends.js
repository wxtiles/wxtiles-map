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
  }

  componentWillMount() {
  }

  showLegends() {
    this.setState({showLegends: true})
  }

  hideLegends() {
    this.setState({showLegends: false})
  }

  render() {
    return this.props.legends.length > 0 && React.createElement('div', {className: 'legends'},
      React.createElement('div', {className: 'legends-control'},
        !this.state.showLegends && React.createElement('a', {href: 'javascript:void(0);', onClick: this.showLegends}, 'Show legends'),
        this.state.showLegends && React.createElement('a', {href: 'javascript:void(0);', onClick: this.hideLegends}, 'Hide legends')
      ),
      this.state.showLegends && _.map(this.props.legends, (legendDatums) => {
        return React.createElement('div', {key: legendDatums.layerId + ' ' + legendDatums.instanceId},
          React.createElement(legend, {
            layerId: legendDatums.layerId,
            instanceId: legendDatums.instanceId,
            label: legendDatums.label
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
