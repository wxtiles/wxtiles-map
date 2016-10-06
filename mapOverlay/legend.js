var React = require('react')
var ReactDOM = require('react-dom')
var _ = require('lodash')
var wxtilesjs = require('./wxtiles')
var rcSwitch = require('rc-switch')
var rcPopover = require('rc-popover')

class legend extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.url = null
    this.toggleSwitch = this.toggleSwitch.bind(this)
    this.loadingError = this.loadingError.bind(this)
  }

  componentWillMount() {
    wxtilesjs.getLegendUrl({
      layerId: this.props.layerId,
      instanceId: this.props.instanceId,
      apikey: this.props.apikey,
      onSuccess: (legendUrl) => {
        this.setState({url: legendUrl})
      },
      onError: (err) => {
        console.log(err)
      }
    })
  }

  toggleSwitch() {
    if(this.props.isChecked) this.props.unCheck({layerId: this.props.layerId})
    if(!this.props.isChecked) this.props.check({layerId: this.props.layerId})
  }

  loadingError() {
    this.setState({url: null})
  }

  render() {
    var popoverTitle = React.createElement('span', {className: 'legendPopoverTitle'}, this.props.label)
    return React.createElement('div', {className: 'legend'},
      React.createElement('div', {},
        React.createElement('div', {className: 'layerLabel'}, this.props.label),
        React.createElement(rcPopover, {title: popoverTitle, content: this.props.description, trigger: 'click'},
          React.createElement('a', {href: 'javascript:void(0);', className: 'description glyphicon glyphicon-question-sign'})
        )
      ),
      React.createElement('div', {className: 'switchWrapper'},
        React.createElement(rcSwitch, {
          onChange: this.toggleSwitch,
          checked: this.props.isChecked,
          checkedChildren: 'on',
          unCheckedChildren: 'off'
        })
      ),
      React.createElement('div', {className: 'imgWrapper'},
        this.state.url && React.createElement('img', {src: this.state.url, onError: this.loadingError})
      )
    )
  }
}

module.exports = legend
