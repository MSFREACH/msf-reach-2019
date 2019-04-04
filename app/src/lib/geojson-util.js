function getFeatures(topoJson, key) {
  return topoJson.objects[key].geometries.map(geom => ({
    type: 'Feature',
    id: geom.properties.id,
    properties: geom.properties || {},
    geometry: {
      type: geom.type,
      coordinates: geom.coordinates,
    },
  }));
}

function getEventFeatures(topoJson, key) {
  return topoJson.objects[key].geometries.map((geom) => {
    geom.properties.event_status = geom.properties.metadata.event_status.toLowerCase();
    return {
      type: 'Feature',
      id: geom.properties.id,
      properties: geom.properties || {},
      geometry: {
        type: geom.type,
        coordinates: geom.coordinates,
        event_status: geom.properties.metadata.event_status,
      },
    };
  });
}

function getFeaturesFromArcs(topoJson, key) {
  return topoJson.objects[key].geometries.map((geom, index) => ({
    type: 'Feature',
    properties: geom.properties || {},
    geometry: {
      type: geom.type,
      coordinates: [topoJson.arcs[index]], // **** topoJSON stores polygon points in arcs
    },
  }));
}

module.exports = {
  getFeatures,
  getEventFeatures,
  getFeaturesFromArcs,
};
