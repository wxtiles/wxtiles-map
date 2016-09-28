var React = require('react')
var ReactDOM = require('react-dom')
var mapWrapper = require('./mapWrapper')

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
    return React.createElement('div', {className: 'root'},
      React.createElement(mapWrapper)
    )
  }
}

module.exports = root
