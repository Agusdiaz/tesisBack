const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET || 'token-secret'

exports.middleware = (req, res, next) => {
   jwt.verify(req.headers.authorization, SECRET, (err) => {
      if (err) {
         //console.log('no token provided...')
         res.status(500).json({ error: "Not Authorized" });
      } else {
         //console.log('token provided...')
         next();
      }
   });
}

exports.verifyToken = (req, res) => {
   jwt.verify(req.body.token, SECRET, (err) => {
      if (err) {
         //console.log('no token provided...')
         res.status(500).json('No autorizado');
      } else {
         //console.log('token provided...')
         res.status(200).json('Autorizado')
      }
   });
}