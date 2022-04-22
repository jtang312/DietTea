import React from 'react';
import ReactDOM from 'react-dom';
import Search from './Search.jsx';
import Stores from './Stores.jsx';
import Favorites from './Favorites.jsx';
import Results from './Results.jsx';
var axios = require('axios');
// var maps = require('../../../maps/maps');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curAddress: '',
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
        const curAddress = prompt('Enter start address: ') || '75 Laval Street Vaughan';
        this.setState({
          favorites: favorites.data,
        })
        this.search.call(this, curAddress);
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
        window.markStores(stores.data);
      })
      .catch(err => console.log(err));
    })
  }

  getDirections(destPlaceID) {
    axios.get(`/calc/${this.state.curAddress}/${destPlaceID}`)
    .then((trip) => {
      this.setState({
        distance: trip.data.distance,
        duration: trip.data.duration,
        destination: trip.data.destination
      })
      return new window.google.maps.Geocoder().geocode({placeId: destPlaceID}); // converts placeID to coordinates
    })
    .then(({results})=> {
      window.markDest(results[0]);
    })
  }

  addToFavorites(destPlaceID) {
    axios.post('/favorite', {placeID: destPlaceID})
    .then(favorites => {
      this.setState({favorites: favorites.data});
    })
  }

  render() {
    return (
      <div>
        <h2>BBT Stores Nearby</h2>
        <Results values={{curAddress: this.state.curAddress, destination: this.state.destination, distance: this.state.distance, duration: this.state.duration}}/>
        <div id="displayContainer">
          <div id="map"></div>
          <div>
            <Search search={this.search.bind(this)}/>
            <Stores stores={this.state.stores} getDirections={this.getDirections.bind(this)} addToFavorites={this.addToFavorites.bind(this)}/>
            <Favorites favs={this.state.favorites} getDirections={this.getDirections.bind(this)}/>
          </div>
        </div>
      </div>
    )
  }
}

export default App;