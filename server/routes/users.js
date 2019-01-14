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
        res.cookie('userId', userDoc.userId, { // 设置cookie
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
      } else {
        res.json({
          status: '1',
          msg: 'userName or userPwd is error',
          result: ''
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

/**
 * 查询当前用户下的购物车数据
 */
router.get('/cartList', (req, res, next) => {
  const userId = req.cookies.userId;
  User.findOne({userId: userId}, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: res.message,
        result: ''
      });
    } else {
      if (userDoc) {
        res.json({
          status: '0',
          msg: 'success',
          result: userDoc.cartList
        });
      }
    }
  });
});

/**
 * 删除用户下的商品
 */
router.post('/delCart', (req, res, next) => {
  const userId = req.cookies.userId;
  const productId = req.body.productId;
  User.update({userId: userId}, {
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: res.message,
        result: ''
      });
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: 'success',
          result: 'delere success'
        });
      }
    }
  });
});

// 编辑商品数量
router.post('/cartEdit', (req, res, next) => {
  const userId = req.cookies.userId;
  const productId = req.body.productId;
  const productNum = req.body.productNum;
  const checked = req.body.checked;
  User.update({userId: userId, 'cartList.productId': productId}, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: res.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: 'success',
        result: 'update success'
      });
    }
  });
});

// 全选商品
router.post('/editCheckAll', (req, res, next) => {
  const userId = req.cookies.userId;
  const checkAll = req.body.checkAll ? '1' : '0';
  User.findOne({userId: userId}, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: res.message,
        result: ''
      });
    } else {
      if (userDoc) {
        userDoc.cartList.forEach(item => {
          item.checked = checkAll;
        });
        userDoc.save((err, doc) => {
          if (err) {
            res.json({
              status: '1',
              msg: res.message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              message: 'success',
              result: 'checkAll success'
            });
          }
        });
      }
    }
  });
});

module.exports = router;
