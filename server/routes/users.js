const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 * 登录
 */
router.post('/login', (req, res, next) => {
  const params = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  User.findOne(params, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      if (userDoc) {
        res.cookie('userId', userDoc.userID, { // 设置cookie
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.json({
          status: '0',
          msg: 'success',
          result: {
            userName: userDoc.userName
          }
        });
      }
    }
  });
});

module.exports = router;
