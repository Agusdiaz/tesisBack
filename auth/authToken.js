const jwt = require('jsonwebtoken');
const SECRET = process.env.REACT_APP_SECRET || 'token-secret'

exports.middleware = (req, res, next) => {
   jwt.verify(req.headers.authorization, SECRET, (err) => {
      if (err) {
         if (req.url.includes('/payments')) res.render('invalid_screen')
         else res.status(500).json({ error: "Not Authorized" });
      } else {
         next();
      }
   });
}

exports.verifyToken = (req, res) => {
   jwt.verify(req.body.token, SECRET, (err) => {
      if (err) {
         res.status(500).json('No autorizado');
      } else {
         res.status(200).json('Autorizado')
      }
   });
}