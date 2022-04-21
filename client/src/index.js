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
  // need to call to web service to get coords from address
  let curAddress = document.getElementById("curAddress").getAttribute("value");
  mapsAPI.addressToLatLong(curAddress)
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
      infoWindow.setContent(`<div style="font-weight:bold;">Start: <div style="font-weight:normal;">- ${curAddress}</div></div>`);
      infoWindow.open(map, marker);

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    })
};

window.markDest = (store, markStores) => {
  // NOTE: needed to load in places library through script tag to be able to get details of a placeId
  var service = new google.maps.places.PlacesService(map);
  // for rendering directions:
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  service.getDetails({placeId: store.place_id}, (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      let shortenedAddress = place.formatted_address.split(',').slice(0, 2).join(',');

      // setting markers and info window
      const marker = new window.google.maps.Marker({
        map,
        place: {
          placeId: place.place_id,
          location: place.geometry.location
        },
        icon: {
          url: place.icon,
          scaledSize: new google.maps.Size(15, 15), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        }
      });
      if (markStores === undefined) {
        const infoWindow = new google.maps.InfoWindow();
        infoWindow.setContent(`<div style="font-weight:bold;">${place.name}<div style="font-weight:normal;">- ${shortenedAddress}</div></div>`);
        infoWindow.open(map, marker);

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      } else {
        const infoWindow = new google.maps.InfoWindow();
        infoWindow.setContent(`<div style="font-weight:bold;">${markStores}. ${place.name}</div>`);

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      }

      // rendering directions
      let request = {
        origin: {query: document.getElementById("curAddress").getAttribute("value")},
        destination: place.formatted_address,
        travelMode: google.maps.TravelMode.WALKING
      }
      directionsService.route(request)
        .then((result) => {
          directionsRenderer.setDirections(result);
        })
    }
  });
}

window.markStores = (stores) => {
  stores.forEach((store, i) => {
    window.markDest(store, i + 1)
  })
}