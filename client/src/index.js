import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.jsx';
var key = require('../../maps/config');
var mapsAPI = require('../../maps/maps');
// import { Loader } from "@googlemaps/js-api-loader"

ReactDOM
  .createRoot(document.getElementById('app'))
  .render(<App />);

// Create the script tag, set the appropriate attributes
var script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${key.key}&libraries=places&callback=initMap`;
script.async = true;

// Append the 'script' element to 'head'
document.head.appendChild(script);

// Attach your callback function to the `window` object
var map
window.initMap = function() {
  // JS API is loaded and available
  // { lat: 43.653226, lng: -79.3831843 } - Toronto

  // need to call to web service to get coords from address
  mapsAPI.addressToLatLong(document.getElementById("curAddress").getAttribute("value"))
    .then((homeCoords) => {
      map = new google.maps.Map(document.getElementById("map"), {
        center: homeCoords,
        zoom: 13,
      });

      const marker = new window.google.maps.Marker({
        position: homeCoords,
        map,
        title: "home",
      });

      const infoWindow = new google.maps.InfoWindow();
      infoWindow.setContent(document.getElementById("curAddress").getAttribute("value"));
      infoWindow.open(map, marker);

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    })
};

window.markDest = (location) => {
  // NOTE: needed to load in places library through script tag to be able to get details of a placeId
  let shortenedAddress = location.formatted_address.split(',').slice(0, 2).join(',');
  let service = new google.maps.places.PlacesService(map);
  service.getDetails({placeId: location.place_id}, (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      const marker = new window.google.maps.Marker({
        map,
        place: {
          placeId: location.place_id,
          location: location.geometry.location
        }
      });

      const infoWindow = new google.maps.InfoWindow();
      infoWindow.setContent(`<div style="font-weight:bold;">${place.name}<div style="font-weight:normal;">- ${shortenedAddress}</div></div>`);
      infoWindow.open(map, marker);

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    }
  });





}
