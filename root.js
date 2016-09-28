var React = require('react')
var ReactDOM = require('react-dom')
var mapWrapper = require('./mapWrapper')
var mapOverlay = require('./mapOverlay')

class root extends React.Component {
  constructor() {
    super()
    this.state = {
      mapOptions: {}
    }
  }

  componentWillMount() {
    this.setState({mapOptions: this.props.mapOptions})
  }

  update({mapOptions}) {
    this.setState({mapOptions})
  }

  render() {
    var mapOptions = this.state.mapOptions
    return React.createElement('div', {className: 'root'},
      React.createElement(mapWrapper, mapOptions),
      React.createElement(mapOverlay, mapOptions)
    )
  }
}

module.exports = root
