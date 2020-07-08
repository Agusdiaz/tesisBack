const router = require('express').Router();

router.get('/', function(req, res) {
  res.json(
      {
        status: 'API Its Working',
        message: 'Welcome',
      });
});


module.exports = router;