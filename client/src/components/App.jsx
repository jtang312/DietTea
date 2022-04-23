import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import Home from './Home.jsx';
// import Stores from './Stores.jsx';
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
      favorites: [],
      user: null
    }
  }

  componentDidMount() {
    axios.get('/favorites')
      .then(response => {
        const curAddress = 'Toronto';
        this.setState({
          favorites: response.data.favorites,
          user: response.data.user.username || ''
        })
        this.search.call(this, curAddress);
      })
      .catch(err => console.log(err))
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
        }, () => {
          window.markStores(this.state.stores);
        })
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
    .catch(err => console.log(err))
  }

  addToFavorites(destPlaceID) {
    axios.post('/favorite', {placeID: destPlaceID})
    .then(favorites => {
      this.setState({favorites: favorites.data});
    })
    .catch(err => console.log(err));
  }

  deleteFav(destPlaceID) {
    axios.post('/deleteFavorite', {placeID: destPlaceID})
    .then(favorites => {
      this.setState({favorites: favorites.data});
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <nav>
            <Link to="/">Home</Link>
            <span>   </span>
            <Link to="/favsPage">Favorites</Link>
          </nav>
          <Results values={{curAddress: this.state.curAddress, destination: this.state.destination, distance: this.state.distance, duration: this.state.duration, user: this.state.user}}/>
          <div id="displayContainer">
            <div id="map"></div>
            <div>
              <Routes>
                <Route path='/' element={<Home search={this.search.bind(this)} stores={this.state.stores} getDirections={this.getDirections.bind(this)} addToFavorites={this.addToFavorites.bind(this)}/>}></Route>
                <Route path="/favsPage" element={<Favorites favs={this.state.favorites} getDirections={this.getDirections.bind(this)} deleteFav={this.deleteFav.bind(this)} />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
