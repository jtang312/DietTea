import React from 'react';

let Results = (props) => {
  return (<div id="results">
    <div>
      <span id="curAddress" value={props.values.curAddress}>Current Address: {props.values.curAddress} | </span>
      <span>Destination: {props.values.destination} </span>
    </div>
    <div>
      <span>Distance: {props.values.distance} km | </span>
      <span>Duration: {Math.floor(props.values.duration/60)} hrs {Math.round(props.values.duration%60)} mins | </span>
      <span>Caloried Burned: {Math.round(props.values.distance) * 62.5} cals</span>
    </div>
  </div>)
}

export default Results;