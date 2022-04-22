const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MVP');

const favoritesSchema = new mongoose.Schema({
  name: String,
  placeID: {type: String, unique: true},
  address: String,
  website: String,
  user: String
});

const usersSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  password: String
});

const Favorites = mongoose.model('Favorites', favoritesSchema);
const Users = mongoose.model('Users', usersSchema);

var save = (entry) => {
  let favorite = new Favorites({
    name: entry.name,
    placeID: entry.placeID,
    address: entry.address,
    website: entry.website,
    user: entry.user
  })
  return favorite.save()
    .then((status) => status)
    .catch(err => console.log('duplicate'));
}

var read = (username) => {
  return Favorites.find({'user': username});
}

var saveUser = (newUser) => {
  let user = new Users({
    username: newUser.username,
    password: newUser.password
  })
  return user.save()
    .then((status) => status)
    .catch(err => console.log('duplicate'));
}

var findUser = ({username, password}) => {
  return Users.find({'username': username, 'password': password});
}

module.exports = {save, read, saveUser, findUser};