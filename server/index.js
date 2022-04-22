var maps = require('../maps/maps');
var db = require('../database/index');
const auth = require('./auth/auth');

const express = require('express');
var cookieParser = require('cookie-parser')
const app = express();
const port = 3030;

// middleware
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static(__dirname + '/../client'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(auth.createUser);

app.get('/', auth.verifyUser, (req, res) => {
  res.redirect(`/dist/index.html`);
})

app.get('/signup', (req, res) => {
  res.cookie('user', null);
  res.cookie('password', null);
  res.render('signup');
})

app.post('/signup', (req, res) => {
  db.saveUser(req.body)
    .then(result => {
      res.cookie('user', req.body.username);
      res.cookie('password', req.body.password);
      res.redirect(`/dist/index.html`);
    })
})

app.get('/login', (req, res) => {
  res.cookie('user', null);
  res.cookie('password', null);
  res.render('login');
})

app.post('/login', (req, res) => {
  console.log('2', req.user, req.body);
  db.findUser(req.user)
    .then(result => {
      if (result.length > 0) {
        res.redirect(`/dist/index.html`);
      } else {
        res.redirect('/login');
      }
    })
})

app.get('/logout', (req, res) => {
  console.log('hi from logout')
  res.cookie('user', '');
  res.cookie('password', '');
  db.deleteNull()
    .then((result) => res.redirect('/login'))
})

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
    .catch(err => console.log(err));
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
        website: addressData.website,
        user: req.user.username
      }
      db.save(entry)
        .then((status) => db.read(req.user.username))
        .then(favorites => res.send(favorites))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
})

app.get('/favorites', auth.verifyUser, (req, res) => {
  db.read(req.user.username)
    .then(favorites => res.send({favorites, user: req.user}))
    .catch(err => console.log(err));
})

app.post('/deleteFavorite', auth.verifyUser, (req, res) => {
  let entry = {
    placeID: req.body.placeID,
    user: req.user.username
  }
  db.deleteFavorite(entry)
    .then((status) => db.read(req.user.username))
    .then(favorites => res.send(favorites))
    .catch(err => console.log(err));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

