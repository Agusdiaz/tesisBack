const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET || 'token-secret'

module.exports = (req, res, next) => {
   jwt.verify(req.headers.authorization, SECRET, (err) => {
      if (err) {
         console.log('no token provided...')
         res.status(500).json({ error: "Not Authorized" });
      } else {
         console.log('token provided...')
         next();
      }
   });
}