var express = require('express');
var router = express.Router();

/* POST users listing. */
router.post('/yName', function(req, res) {
  res.send('yNameTest');
});

router.post('/gName', function(req, res) {
  res.send('testing123');
});


module.exports = router;