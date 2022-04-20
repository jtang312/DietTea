var axios = require('axios');
var key = require('./config.js');

let addressToLatLong = (address) => {
  address = address.replace(/ /g, '+');
  let api_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key.key}`;
  var config = {
    method: 'get',
    url: api_url,
    headers: { }
  };

  return axios(config)
  .then(function (response) {
    return response.data.results[0].geometry.location;
  })
  .catch(function (error) {
    console.log(error);
  });
}

let nearbySearch = ({lat = null, lng = null}) => {
  let api_url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=bubble+tea&location=${lat}%2C${lng}&type=cafe&key=${key.key}&rankby=distance`;
  var config = {
    method: 'get',
    url: api_url,
    headers: { }
  };

  return axios(config)
    .then((response) => response.data.results)
    .catch((err) => console.log(err));
}

let getDirections = (origin, destination) => {
  let api_url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat}%2C${origin.lng}&destination=place_id:${destination}&mode=walking&key=${key.key}`;
  var config = {
    method: 'get',
    url: api_url,
    headers: { }
  };

  return axios(config)
    .then((response) => response.data)
    .catch((err) => console.log(err));
}

let placeIdToAddress = (placeID) => {
  let api_url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&key=${key.key}`;
  var config = {
    method: 'get',
    url: api_url,
    headers: { }
  };

  return axios(config)
    .then(response => response.data.result)
    .catch(err => console.log(err));
}

module.exports = {addressToLatLong, nearbySearch, getDirections, placeIdToAddress}