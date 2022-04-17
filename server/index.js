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

app.get('/calc:origin:dest', (req, res) => {
  console.log(req.params)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})