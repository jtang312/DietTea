import React from 'react';

let Results = (props) => {
  return (<div id="results">
    <h2>BBT Stores Nearby</h2>
    <div>
      <form action="/login">
        <input type="submit" value="Login" />
      </form>
      <form action="/logout">
        <input type="submit" value="Logout" />
      </form>
      <div>User: {props.values.user}</div>
      <span id="curAddress" value={props.values.curAddress}>Current Address: {props.values.curAddress} | </span>
      <span>Destination: {props.values.destination} </span>
    </div>
    <div>
      <span>Distance: {props.values.distance ? props.values.distance.toFixed(1) : 0} km | </span>
      <span>Duration: {Math.floor(props.values.duration/60)} hrs {Math.round(props.values.duration%60)} mins | </span>
      <span>Caloried Burned: {Math.round(props.values.distance) * 62.5} cals</span>
    </div>
  </div>)
}

export default Results;