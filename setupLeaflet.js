var leaflet = require('leaflet')

module.exports = function (options) {
  var leafletMap = leaflet.map('leafletMap', {
    zoom: 5
  }).setView([-20, 160], 2)

  var baseMap = leaflet.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(leafletMap)

  var addLayer = function({url, opacity}) {
    var leafletMapLayer = leaflet.tileLayer(url, {
      tms: true,
      opacity: opacity
    });
    leafletMapLayer.addTo(leafletMap);
  }

  return {
    addLayer: addLayer
  }
}
