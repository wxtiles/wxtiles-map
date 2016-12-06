var React = require('react')
var ReactDOM = require('react-dom')
var legends = require('./mapOverlay/legends')
var _ = require('lodash')
var timeSlider = require('./mapOverlay/timeSlider')
var moment = require('moment-timezone')

class mapOverlay extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.time = null
    this.toggleAnimation = this.toggleAnimation.bind(this)
    this.adjustAnimationSpeed = this.adjustAnimationSpeed.bind(this)
    this.selectTime = this.selectTime.bind(this)
    this.updateVisibleLayers = this.updateVisibleLayers.bind(this)
  }

  componentWillMount() {
  }

  selectTime({time}) {
    var mapOptions = this.props.mapOptions
    mapOptions.time = time
    this.props.update({mapOptions})
  }

  toggleAnimation() {
    var mapOptions = this.props.mapOptions
    mapOptions.isAnimating = !mapOptions.isAnimating
    this.props.update({mapOptions})
  }

  adjustAnimationSpeed(minutes) {
    var mapOptions = this.props.mapOptions
    mapOptions.animationFrameMinutes = minutes
    this.props.update({mapOptions})
  }

  updateVisibleLayers({layers}) {
    var mapOptions = this.props.mapOptions
    _.forEach(mapOptions.layers, (stateFulLayer) => {
      _.forEach(layers, (legendLayer) => {
        if (legendLayer.layerId == stateFulLayer.id) stateFulLayer.isVisible = legendLayer.isVisible
      })
    })
    this.props.update({mapOptions})
  }

  render() {
    var mapOptions = this.props.mapOptions
    var layers = mapOptions.layers
    layers = _.filter(layers, (layer) => layer != null)
    var legendsDatums = _.map(layers, (layer) => {
      return {
        label: layer.label,
        url: layer.legendUrl,
        layerId: layer.id,
        instanceId: layer.instanceId,
        isVisible: layer.isVisible,
        description: layer.description,
        apikey: layer.apikey
      }
    })

    var timeSliderProps = {
      earliestTime: mapOptions.earliestTime,
      time: mapOptions.time,
      defaultValue: mapOptions.now,
      times: mapOptions.times,
      marks: mapOptions.marks,
      latestTime: mapOptions.latestTime,
      isAnimating: mapOptions.isAnimating,
      animationFrameMinutes: mapOptions.animationFrameMinutes,
      selectTime: this.selectTime,
      toggleAnimation: this.toggleAnimation,
      adjustAnimationSpeed: this.adjustAnimationSpeed
    }

    return React.createElement('div', {className: 'mapControls'},
      React.createElement(legends, {legends: legendsDatums, updateVisibleLayers: this.updateVisibleLayers}),
      React.createElement('div', {className: 'timeSliderWrapper'},
        React.createElement('div', {style: {marginLeft: 'auto', marginRight: 'auto', width: '700px'}},
          React.createElement(timeSlider, timeSliderProps)
        )
      )
    )
  }
}

module.exports = mapOverlay
