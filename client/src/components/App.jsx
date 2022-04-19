import React from 'react';
import ReactDOM from 'react-dom';
import Search from './Search.jsx';
import Stores from './Stores.jsx';
import Favorites from './Favorites.jsx';
var axios = require('axios');
// var db = require('../../../database/index');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curAddress: '75 Laval Street Vaughan',
      distance: null,
      duration: null,
      stores: [],
      favorites: []
    }
  }

  componentDidMount() {
    console.log('mounted');
    axios.get('/favorites')
      .then(favorites => {
        this.setState({
          favorites: favorites.data
        })
      })
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
        duration: trip.data.duration
      })
    )
    .then(() => {
      return axios.post('/favorite', {placeID: destPlaceID})
    })
    .then(favorites => {
      this.setState({favorites: favorites.data});
    })
  }

  render() {
    return (
      <div>
        <h2>BBT Stores Nearby</h2>
        <div>Current Address: {this.state.curAddress}</div>
        <div>Distance: {this.state.distance} km | Duration: {this.state.duration} mins
        | Calories Burned: {Math.round(this.state.distance * 62.5)}</div>
        <Search search={this.search.bind(this)}/>
        <Stores stores={this.state.stores} getDirections={this.getDirections.bind(this)}/>
        <Favorites favs={this.state.favorites} getDirections={this.getDirections.bind(this)}/>
      </div>
    )
  }
}

export default App;