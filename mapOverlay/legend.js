var React = require('react')
var ReactDOM = require('react-dom')
var _ = require('lodash')
var wxtilesjs = require('./wxtiles')

class legend extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.url = null
  }

  componentWillMount() {
    wxtilesjs.getLegendUrl({
      layerId: this.props.layerId,
      instanceId: this.props.instanceId,
      onSuccess: (legendUrl) => {
        this.setState({url: legendUrl})
      },
      onError: (err) => {
        console.log(err)
      }
    })
  }

  render() {
    return React.createElement('div', {className: 'legend'},
      React.createElement('div', {}, this.props.label),
      this.state.url && React.createElement('img', {src: this.state.url})
    )
  }
}

module.exports = legend
