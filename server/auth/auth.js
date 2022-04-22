const db = require('../../database/index');

const createUser = (req, res, next) => {
  let username = req.cookies.user;
  let password = req.cookies.password;
  console.log(req.cookies, req.body);

  db.findUser({username, password})
    .then(result => {
      console.log('hi', result);
      if (result.length > 0) {
        res.cookie('user', result[0].username);
        res.cookie('password', result[0].password);
        req.user = {'username': result[0].username, 'password': result[0].password};
        console.log('found', req.user);
      } else {
        res.cookie('user', req.body.username);
        res.cookie('password', req.body.password);
        req.user = {'username': req.body.username, 'password': req.body.password};
        console.log('not found', req.user);
      }
      next();
    })
}

const verifyUser = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = {createUser, verifyUser}