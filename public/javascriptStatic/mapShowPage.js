mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: campgrounds.geometry.coordinates,
  zoom: 8,
});

new mapboxgl.Marker().setLngLat(campgrounds.geometry.coordinates).addTo(map);
