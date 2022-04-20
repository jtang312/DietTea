var maps = require('../maps/maps');
var db = require('../database/index');

const express = require('express')
const cors = require('cors');
const app = express()
const port = 3030

// middleware
app.use(cors());
app.use(express.static(__dirname + '/../client/dist'));
app.use(express.json());

app.post('/bbt', (req, res) => {
  maps.addressToLatLong(req.body.address)
    .then((coords) => {
      return maps.nearbySearch(coords);
    })
    .then((stores) => {
      let pickedFields = stores.map((store) => {
        return {
          place_id: store.place_id,
          name: store.name,
          open: (store.opening_hours) ? store.opening_hours.open_now : false,
          rating: store.rating,
          numOfRatings: store.user_ratings_total,
          location: store.geometry.location
        }
      })
      res.send(pickedFields)
    })
})

app.get('/calc/:origin/:dest', (req, res) => {
  maps.addressToLatLong(req.params.origin)
    .then((originCoords) => {
      return maps.getDirections(originCoords, req.params.dest)
    })
    .then(directions => {
      let trip = {
        distance: directions.routes[0].legs[0].distance.value / 1000,
        duration: Math.round(directions.routes[0].legs[0].duration.value / 60),
        destination: directions.routes[0].legs[0].end_address.split(',').slice(0, 2).join(',')
      };
      res.send(trip);
    })
    .catch(err => console.log(err));
})

// saves bbt store to db and returns updated list of favorites
app.post('/favorite', (req, res) => {
  maps.placeIdToAddress(req.body.placeID)
    .then((addressData) => {
      let entry = {
        name: addressData.name,
        placeID: req.body.placeID,
        address: addressData.formatted_address,
        website: addressData.website
      }
      db.save(entry)
        .then((status) => db.read())
        .then(favorites => res.send(favorites))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
})

app.get('/favorites', (req, res) => {
  db.read()
    .then(favorites => res.send(favorites));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

