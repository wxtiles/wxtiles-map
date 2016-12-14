var React = require('react')
var rcSlider = require('rc-slider')
var moment = require('moment-timezone')
var _ = require('lodash')
var humanizeDuration = require('humanize-duration')

class timeSlider extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnAfterChange = this.handleOnAfterChange.bind(this)
    this.doAnimationFrame = this.doAnimationFrame.bind(this)
    this.changeAnimationRate = this.changeAnimationRate.bind(this)
    this.halveSpeed = this.halveSpeed.bind(this)
    this.doubleSpeed = this.doubleSpeed.bind(this)
  }

  componentWillMount() {
    setInterval(this.doAnimationFrame, 50)
  }

  doAnimationFrame() {
    var isAnimating = this.props.isAnimating
    var time = this.props.time
    var latestTime = this.props.latestTime
    var earliestTime = this.props.earliestTime
    if(isAnimating) {
      time.add(this.props.animationFrameMinutes, 'minute')
      if(time.isAfter(latestTime)) {
        time = earliestTime
      }
      this.handleOnAfterChange(+time)
    }
  }

  changeAnimationRate(options) {
    _.defaults(options, {rate: 1})
    var mapOptions = this.props
    var currentRate = mapOptions.animationFrameMinutes ? mapOptions.animationFrameMinutes : ((mapOptions.latestTime - mapOptions.earliestTime) / 1000 / 60) * 0.01
    var maxRate = ((mapOptions.latestTime - mapOptions.earliestTime) / 1000 / 60) * 0.33
    var newRate = _.clamp(currentRate * options.rate, 1, maxRate)
    this.props.adjustAnimationSpeed(newRate)
  }

  halveSpeed(){
    this.changeAnimationRate({rate: 0.5})
  }

  doubleSpeed(){
    this.changeAnimationRate({rate: 2})
  }

  handleOnChange(time) {
    this.props.selectTime({time: moment.utc(time), ignore: true})
  }

  handleOnAfterChange(time) {
    this.props.selectTime({time: moment.utc(time), ignore: false})
  }

  render() {
    var times = this.props.times
    var earliestTime = this.props.earliestTime
    if (!earliestTime) earliestTime = 1
    var latestTime = this.props.latestTime
    if (!latestTime) latestTime = 1
    var marks = this.props.marks
    var isAnimating = this.props.isAnimating
    var displayTime = this.props.time

    return React.createElement('div', {className: 'timeSlider'},
      React.createElement('div', {},
        React.createElement('div', {className: 'animationControl'},
          !isAnimating && React.createElement('div', {onClick: this.props.toggleAnimation, className: 'glyphicon glyphicon-play'}),
          isAnimating && React.createElement('div', {onClick: this.props.toggleAnimation, className: 'glyphicon glyphicon-pause'}),
          React.createElement('div', {onClick: this.halveSpeed, className: 'speed-button glyphicon glyphicon-minus-sign'}),
          React.createElement('div', {onClick: this.doubleSpeed, className: 'speed-button glyphicon glyphicon-plus-sign'})
        ),
        React.createElement('div', {className: 'reactSliderContainer'},
          React.createElement(rcSlider, {
            included: false,
            min: +earliestTime,
            max: +latestTime,
            value: +this.props.time,
            marks: marks,
            tipFormatter: (tip) => {
              var t = moment.duration(moment(tip).diff(moment())).asMilliseconds()
              var args = {
                'conjunction': ' and ',
                'largest': Math.abs(t) > 3600000 ? 2 : 1,
                'serialComma': false
              }
              return t > -60000 && t < 60000 ? 'now' : t < 0 ? humanizeDuration(t, args) + ' ago' : 'in ' + humanizeDuration(t, args)
            },
            onChange: this.handleOnChange,
            onAfterChange: this.handleOnAfterChange
          })
        )
      ),
      React.createElement('div', {className: 'displayDate'}, displayTime.local().format('ddd MMM DD \u2014 hh:mm A') + ' ' + moment.tz(moment.tz.guess()).format('z'))
    )
  }
}

module.exports = timeSlider
