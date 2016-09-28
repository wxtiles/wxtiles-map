var React = require('react')
var ReactDOM = require('react-dom')
var mapWrapper = require('./mapWrapper')
var mapOverlay = require('./mapOverlay')
var moment = require('moment-timezone')
var _ = require('lodash')

var calculateLayerBufferUsingTime = (mapOptions) => {
  var time = mapOptions.time
  _.forEach(mapOptions.layers, (layer) => {
    layer.timeUrlsToRender = _.filter(layer.timeUrls, (timeUrl) => {
      var earlyBounds = time.clone().add(-4, 'hour')
      var lateBounds = time.clone().add(4, 'hour')
      if (timeUrl.time.isBefore(earlyBounds)) return false
      if (timeUrl.time.isAfter(lateBounds)) return false
      return true
    })
    layer.timeUrlsToRender = _.sortBy(layer.timeUrlsToRender, (timeUrl) => +timeUrl.time)
    var layerHasVisibleTime = false
    _.forEach(layer.timeUrlsToRender, (timeUrl) => {
      timeUrl.isVisible = false
      if (layerHasVisibleTime) return
      if (timeUrl.time.isAfter(time)) {
        layerHasVisibleTime = true
        timeUrl.isVisible = true
      }
    })
  })
  return mapOptions
}

class root extends React.Component {
  constructor() {
    super()
    this.state = {
    }

    this.update = this.update.bind(this)
  }

  componentWillMount() {
    var mapOptions = this.props.mapOptions
    mapOptions.time = moment.utc()
    this.update({mapOptions})
  }

  update({mapOptions}) {
    var mapOptions = calculateLayerBufferUsingTime(mapOptions)
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
