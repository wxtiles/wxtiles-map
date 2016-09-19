var leaflet = require('leaflet')

module.exports = function ({zoom, center}) {
  zoom = zoom || 2
  center = center || [-20, 160]
  var leafletMap = leaflet.map('leafletMap').setView(center, zoom)

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
