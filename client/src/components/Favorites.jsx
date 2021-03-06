import React from 'react';

var Favorites = (props) => {
  return (
    <section>
      <h2>Favorites</h2>
      <ol>
        {(props.favs.length > 0 && typeof props.favs === 'object') ? props.favs.map(fav => (
          <li key={fav._id}>
            <a href={fav.website} onClick={() => {props.getDirections(fav.placeID); return true;}} target="_blank">{fav.name}</a>
            <span> | Address: {fav.address.split(',').slice(0, 2).join(',')}</span>
            <button onClick={() => {props.deleteFav(fav.placeID)}}><i className="fa fa-trash-o"></i></button>
          </li>
        )) : <div></div>}
      </ol>
    </section>
  )
}

export default Favorites;