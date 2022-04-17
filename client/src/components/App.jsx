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
    console.log(lat, lng)
    axios.get(`/calc/${this.state.curAddress}/${destination}`)
    .then((directions) => {
      console.log(directions);
    })
  }

  saveToDB(store) {

  }

  render() {
    return (
      <div>
        <h2>BBT Stores Nearby</h2>
        <div>Current Address: {this.state.curAddress} </div>
        <Search search={this.search.bind(this)}/>
        <Stores stores={this.state.stores} getDirections={this.getDirections.bind(this)}/>
      </div>
    )
  }
}

export default App;