const CONCORDANCE = {
  "ncep-mrms-us-reflectivity-dbz": {
    layerId: "mrms-reflectivity", styleId: "reflectivity"
  },
  "ncep-mrms-us-lightning-prob": {
    layerId: "mrms-lightning-probability", styleId: "probability"
  },
  "ncep-ndfd-us-windspd-knots": {
    layerId: "ndfd-wind", styleId: "wind-speed"
  },
  "ncep-ndfd-us-windgust-knots": {
    layerId: "ndfd-windgust", styleId: "wind-speed"
  },
  "ncep-ndfd-us-winddir": {
    layerId: "ndfd-wind", styleId: "wind-direction"
  },
  "ncep-gfs-global-mslp-si": {
    layerId: "ncep-mslp", styleId: "atmospheric-pressure-unfilled-mono"
  }
}

var v1transform = function (layerId) {
  var concord = CONCORDANCE[layerId]
  return concord ? concord : {layerId: layerId, styleId: undefined}
}

module.exports = v1transform
