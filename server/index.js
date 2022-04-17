var maps = require('../maps/maps');

const express = require('express')
const app = express()
const port = 3030

// middleware
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
        duration: Math.round(directions.routes[0].legs[0].duration.value / 60)
      };
      res.send(trip);
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

