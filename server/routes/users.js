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
        res.cookie('userName', userDoc.userName, { // 设置cookie
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

/**
 * 退出登录
 */
router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', { // 清除cookie
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '0',
    msg: 'success',
    result: 'logout success'
  });
});

/**
 * 登录校验
 */
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName || ''
    });
  } else {
    res.json({
      status: '1',
      msg: 'you are not login',
      result: ''
    });
  }
});

module.exports = router;
