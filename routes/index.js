var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/save-messages', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/retrieve-messages', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
