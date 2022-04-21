import React from 'react';

var Stores = (props) => (
  <div>
    <ol>
      {props.stores.map(store => {
        return (
          <li key={store.place_id}>
            <a onClick={() => props.getDirections(store.place_id)}> {store.name} - {store.rating}/5 ({store.numOfRatings})</a>
          </li>
        )
      })}
    </ol>
  </div>
)

export default Stores;