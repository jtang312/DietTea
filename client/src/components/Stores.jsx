import React from 'react';

var Stores = (props) => (
  <div>
    <ol>
      {props.stores.map(store => {
        return (
          <li key={store.place_id}>
            <button onClick={() => props.getDirections(store.place_id)}>{store.name} - {store.rating}/5 ({store.numOfRatings})</button>
            <button onClick={() => props.addToFavorites(store.place_id)}><i className="fa fa-heart"></i></button>

          </li>
        )
      })}
    </ol>
  </div>
)

export default Stores;