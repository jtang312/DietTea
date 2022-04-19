const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MVP');

const favoritesSchema = new mongoose.Schema({
  name: String,
  placeID: {type: String, unique: true},
  address: String,
  website: String
});

const Favorites = mongoose.model('Favorites', favoritesSchema);

var save = (entry) => {
  let favorite = new Favorites({
    name: entry.name,
    placeID: entry.placeID,
    address: entry.address,
    website: entry.website
  })
  return favorite.save()
    .then((status) => status)
    .catch(err => console.log('duplicate'));
}

var read = () => {
  return Favorites.find();
}

module.exports = {save, read};