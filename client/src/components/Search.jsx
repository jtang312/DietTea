import React from 'react';
import ReactDOM from 'react-dom';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: ''
    }
  }

  setAddress(event) {
    this.setState({
      address: event.target.value
    })
  }

  search(event) {
    // send request to server to search Google Maps API
    if (event.key === 'Enter' || !event.key) {
      this.props.search(this.state.address);
    }
  }

  render () {
    return (
      <div>
        Enter a Search Address: <input type="text" onChange={this.setAddress.bind(this)} onKeyPress={this.search.bind(this)}/>
        <button type="submit" onClick={this.search.bind(this)}>Search</button>
      </div>
    )
  }
}

export default Search;