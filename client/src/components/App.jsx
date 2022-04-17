import React from 'react';
import ReactDOM from 'react-dom';
import Search from './Search.jsx';
import Stores from './Stores.jsx';
var axios = require('axios');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curAddress: '',
      distance: null,
      duration: null,
      stores: []
    }
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

  getDirections(destination) {
    axios.get(`/calc/${this.state.curAddress}/${destination}`)
    .then((trip) => {
      this.setState({
        distance: trip.data.distance,
        duration: trip.data.duration
      })
    })
  }

  saveToDB(store) {

  }

  render() {
    return (
      <div>
        <h2>BBT Stores Nearby</h2>
        <div>Current Address: {this.state.curAddress}</div>
        <div>Distance: {this.state.distance} km | Duration: {this.state.duration} mins </div>
        <Search search={this.search.bind(this)}/>
        <Stores stores={this.state.stores} getDirections={this.getDirections.bind(this)}/>
      </div>
    )
  }
}

export default App;