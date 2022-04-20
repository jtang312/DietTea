import React from 'react';
import ReactDOM from 'react-dom';
import Search from './Search.jsx';
import Stores from './Stores.jsx';
import Favorites from './Favorites.jsx';
var axios = require('axios');
// var maps = require('../../../maps/maps');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curAddress: '75 Laval Street Vaughan',
      destination: null,
      distance: null,
      duration: null,
      stores: [],
      favorites: []
    }
  }

  componentDidMount() {
    axios.get('/favorites')
      .then(favorites => {
        this.setState({
          favorites: favorites.data
        })
      })
  }

  componentDidUpdate() {
    window.initMap();
  }

  search(address) {
    this.setState({
      curAddress: address
    }, () => {
      axios.post('/bbt', {
        address: address
      })
      .then((stores) => {
        this.setState({
          stores: stores.data
        })
      })
    })
  }

  getDirections(destPlaceID) {
    axios.get(`/calc/${this.state.curAddress}/${destPlaceID}`)
    .then((trip) =>
      this.setState({
        distance: trip.data.distance,
        duration: trip.data.duration,
        destination: trip.data.destination
      })
    )
    .then(() => {
      return axios.post('/favorite', {placeID: destPlaceID})
    })
    .then(favorites => {
      this.setState({favorites: favorites.data});
      return new window.google.maps.Geocoder().geocode({placeId: destPlaceID}); // converts placeID to coordinates
    })
    .then(({results})=> {
      console.log(results[0]);
      window.markDest(results[0]);
    })
  }

  render() {
    return (
      <div>
        <h2>BBT Stores Nearby</h2>
        <div id="curAddress" value={this.state.curAddress}>Current Address: {this.state.curAddress} | Destination: {this.state.destination}</div>
        <div>Distance: {this.state.distance} km | Duration: {this.state.duration} mins
        | Calories Burned: {Math.round(this.state.distance * 62.5)}</div>
        <div>
        <div id="map"></div>
        </div>
        <Search search={this.search.bind(this)}/>
        <Stores stores={this.state.stores} getDirections={this.getDirections.bind(this)}/>
        <Favorites favs={this.state.favorites} getDirections={this.getDirections.bind(this)}/>
      </div>
    )
  }
}

export default App;