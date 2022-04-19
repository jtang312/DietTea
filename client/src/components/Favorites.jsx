import React from 'react';

var Favorites = (props) => {
  return (
    <div>
      <h2>Favorites</h2>
      <ol>
        {props.favs.map(fav => (
          <li key={fav._id}>
            <a href={fav.website} onClick={() => {props.getDirections(fav.placeID); return true;}} target="_blank">{fav.name}</a>
            <span> | Address: {fav.address.split(',').slice(0, 2).join(',')}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default Favorites;