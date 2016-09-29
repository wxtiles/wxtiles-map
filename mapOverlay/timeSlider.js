var React = require('react')
var rcSlider = require('rc-slider')
var moment = require('moment-timezone')
var _ = require('lodash')

class timeSlider extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.selectTime = this.selectTime.bind(this)
    this.doAnimationFrame = this.doAnimationFrame.bind(this)
  }

  componentWillMount() {
    setInterval(this.doAnimationFrame, 25)
  }

  doAnimationFrame() {
    var isAnimating = this.props.isAnimating
    var time = this.props.time
    var latestTime = this.props.latestTime
    var earliestTime = this.props.earliestTime
    if(isAnimating) {
      time.add(30, 'minute')
      if(time.isAfter(latestTime)) {
        time = earliestTime
      }
      this.selectTime(+time)
    }
  }

  selectTime(time) {
    this.props.selectTime({time: moment.utc(time)})
  }

  render() {
    var times = this.props.times
    var earliestTime = this.props.earliestTime
    if (!earliestTime) earliestTime = 1
    var latestTime = this.props.latestTime
    if (!latestTime) latestTime = 1
    var marks = this.props.marks
    var isAnimating = this.props.isAnimating
    var displayTime = this.props.displayTime

    return React.createElement('div', {className: 'timeSlider'},
      React.createElement('div', {},
        !isAnimating && React.createElement('div', {onClick: this.props.toggleAnimation, className: 'glyphicon glyphicon-play'}),
        isAnimating && React.createElement('div', {onClick: this.props.toggleAnimation, className: 'glyphicon glyphicon-pause'}),
        React.createElement('div', {className: 'reactSliderContainer'},
          React.createElement(rcSlider, {
            included: false,
            min: +earliestTime,
            max: +latestTime,
            value: +this.props.time,
            marks: marks,
            tipFormatter: null,
            onChange: this.selectTime
          })
        )
      ),
      React.createElement('div', {}, displayTime.local().format('MMM DD - hh:mm a') + ' ' + moment.tz(moment.tz.guess()).format('z'))
    )
  }
}

module.exports = timeSlider
