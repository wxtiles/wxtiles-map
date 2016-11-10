var React = require('react')
var ReactDOM = require('react-dom')
var mapWrapper = require('./mapWrapper')
var mapOverlay = require('./mapOverlay')
var moment = require('moment-timezone')
var _ = require('lodash')

var calculateLayerBufferUsingTime = (mapOptions) => {
  console.log('calculate layer buffer time')
  var time = mapOptions.time
  _.forEach(mapOptions.layers, (layer) => {
    layer.timeUrlsToRender = _.filter(layer.timeUrls, (timeUrl) => {
      var earlyBounds = time.clone().add(-6, 'hour')
      var lateBounds = time.clone().add(12, 'hour')
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

var calculateAllTimes = (mapOptions) => {
  console.log('calculate all times')
  mapOptions.times = []
  _.forEach(mapOptions.layers, (layer) => {
    _.forEach(layer.timeUrls, (timeUrl) => {
      mapOptions.times.push(timeUrl.time)
    })
  })
  mapOptions.times = _.sortBy(mapOptions.times, (time) => +time)
  mapOptions.earliestTime = _.first(mapOptions.times)
  mapOptions.latestTime = _.last(mapOptions.times)
  mapOptions.marks = {}
  _.forEach(mapOptions.times, (time) => {
    mapOptions.marks[+time] = ''
  })
  return mapOptions
}

class root extends React.Component {
  constructor() {
    super()
    this.state = {
    }

    this.update = this.update.bind(this)
    this.updateMapOverlay = this.updateMapOverlay.bind(this)
  }

  componentWillMount() {
    var mapOptions = this.props.mapOptions
    mapOptions.isAnimating = false
    mapOptions.displayTime = mapOptions.time
    this.update({mapOptions})
  }

  update({mapOptions}) {
    var mapOptions = calculateLayerBufferUsingTime(mapOptions)
    var mapOptions = calculateAllTimes(mapOptions)
    this.setState({mapOptions})
  }

  updateMapOverlay({mapOptions}) {
    var mapOptions = calculateLayerBufferUsingTime(mapOptions)
    this.setState({mapOptions})
  }

  render() {
    var mapOptions = this.state.mapOptions
    return React.createElement('div', {className: 'root'},
      React.createElement(mapWrapper, mapOptions),
      React.createElement(mapOverlay, {mapOptions, update: this.updateMapOverlay})
    )
  }
}

module.exports = root
