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

let nearbySearch = ({lat, lng}) => {
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

let getDirections = (destination) => {
  let api_url = `https://maps.googleapis.com/maps/api/directions/json?origin=75+Laval+Street+Vaughan+ON&destination=place_id:ChIJcYaItIAvK4gRnEVI3FoNw90&key=${key.ley}`;
  var config = {
    method: 'get',
    url: api_url,
    headers: { }
  };

  return axios(config)
    .then((response) => response.data)
    .catch((err) => console.log(err));
}

module.exports = {addressToLatLong, nearbySearch}