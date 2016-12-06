var React = require('react')
var ReactDOM = require('react-dom')
var mapWrapper = require('./mapWrapper')
var mapOverlay = require('./mapOverlay')
var moment = require('moment-timezone')
var _ = require('lodash')

var calculateLayerBufferUsingTime = (mapOptions) => {
  // console.log('calculate layer buffer time')
  var mapTime = mapOptions.time
  var tileLayers = []
  var bufferLength = 5 // TODO this could be based on animation speed?
  var lowerBufferLength = 5
  var buffer = []
  _.forEach(mapOptions.layers, (layer) => {
    var afterSelectedTime = _.filter(layer.timeUrls, (timeUrl, key) => {
      return timeUrl.time.isSameOrAfter(mapTime.clone().add(30, 'minutes'))
    }).slice(0, bufferLength)
    if (afterSelectedTime.length == 0) {
      // Current time is beyond upper range of layer
      // Skip; we first need check if it's within tolerance time at upper edge
      // before giving a layer nothing to render
    } else if (!mapTime.isSame(_.first(afterSelectedTime).time)) {
      // We're actually working with durations
      // Preprend the last time that is before the current time
      afterSelectedTime.unshift(layer.timeUrls[layer.timeUrls.indexOf(afterSelectedTime[0])-1])
    }
    var beforeSelectedTime = _.filter(layer.timeUrls, (timeUrl) => {
      return timeUrl.time.isSameOrBefore(mapTime)
    })
    if (beforeSelectedTime.length == 0) {
      // Current time is below lower range of layer
      layer.timeUrlsToRender = []
      return
    }
    if ((beforeSelectedTime.length > 0) && (afterSelectedTime.length == 0)) {
      // mapTime is to the right of layer's time extent;
      // We want to continue showing the last time for a short period,
      // otherwise it will never be seen, even if it's the most recent obs
      var start = beforeSelectedTime.slice(-2,-1)[0].time.clone()
      var end = beforeSelectedTime.slice(-1)[0].time.clone()
      var lastTimeRange = beforeSelectedTime.length > 1 ? end.diff(start, 'minutes') : 60
      var validUntil = end.add(lastTimeRange, 'minutes')
      if (mapTime.diff(validUntil, 'minutes') <= lastTimeRange) {
        afterSelectedTime = beforeSelectedTime.slice(-1)
        beforeSelectedTime = []
      } else {
        layer.timeUrlsToRender = []
        return
      }
    } else if (afterSelectedTime.length == 0) {
      layer.timeUrlsToRender = []
      return
    }
    if (afterSelectedTime.length < bufferLength) {
      // Get elements from the front of the array (facilitates looping)
      buffer = afterSelectedTime.concat(beforeSelectedTime.slice(0, Math.min(lowerBufferLength, bufferLength - afterSelectedTime.length)))
    } else {
      buffer = afterSelectedTime
    }
    layer.timeUrlsToRender = _.flatten(buffer.filter(Boolean))
    _.forEach(layer.timeUrlsToRender, (timeUrl, key) => {
      timeUrl.isVisible = key === 0 ? true: false
    })
  })
  return mapOptions
}

var calculateAllTimes = (mapOptions) => {
  // console.log('calculate all times')
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

var calculateAnimationSpeed = (mapOptions) => {
  mapOptions.times = _.sortBy(mapOptions.times, (time) => +time)
  mapOptions.earliestTime = _.first(mapOptions.times)
  mapOptions.latestTime = _.last(mapOptions.times)
  mapOptions.animationFrameMinutes = mapOptions.animationFrameMinutes ? mapOptions.animationFrameMinutes: ((mapOptions.latestTime - mapOptions.earliestTime) / 1000 / 60) * 0.01
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
    mapOptions.time = moment.utc()
    mapOptions.isAnimating = false
    mapOptions.displayTime = mapOptions.time
    this.update({mapOptions})
  }

  update({mapOptions}) {
    var mapOptions = calculateLayerBufferUsingTime(mapOptions)
    var mapOptions = calculateAllTimes(mapOptions)
    var mapOptions = calculateAnimationSpeed(mapOptions)
    this.setState({mapOptions})
  }

  updateMapOverlay({mapOptions}) {
    var mapOptions = calculateLayerBufferUsingTime(mapOptions)
    var mapOptions = calculateAnimationSpeed(mapOptions)
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
