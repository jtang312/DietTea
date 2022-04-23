const db = require('../../database/index');

const createUser = (req, res, next) => {
  let username = req.cookies.user;
  let password = req.cookies.password;

  // searches user table for using info attached to cookie
  db.findUser({username, password})
    .then(result => {
      if (result.length > 0) {
        // if cookie can identiy existing user (applies during routing throughout site)
        res.cookie('user', result[0].username);
        res.cookie('password', result[0].password);
        req.user = {'username': result[0].username, 'password': result[0].password};
        console.log('found', req.user);
      } else {
        // if user can't be found with cookie, set a cookie on user computer (to be sent on next res.send or res.redirect)
        // on login/signup routes, req.body properties can be used to set cookie for later site routing
        // gives undefined cookie and req.user for direct calls to /dist/index.html (corresponds to anonymous user)
        res.cookie('user', req.body.username);
        res.cookie('password', req.body.password);
        req.user = {'username': req.body.username, 'password': req.body.password};
        console.log('not found', req.user);
      }
      next();
    })
}

// not really necessary since will at worst be anonymous user
const verifyUser = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = {createUser, verifyUser}